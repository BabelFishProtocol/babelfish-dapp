import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { throwError } from 'redux-saga-test-plan/providers';
import { pick } from '../../../utils/helpers';
import { GovernorTypes, ProposalState, Reducers } from '../../../constants';
import { GovernorAlpha__factory } from '../../../contracts/types';
import { rootReducer, RootState } from '../..';

import { mockSigner, createMockedContract } from '../../../testUtils';
import { ProposalDetailsQueryResult } from '../../../queries/proposalDetailsQuery';

import {
  governorContractsSelector,
  selectedProposalGovernor,
  selectedProposalSelector,
} from '../proposals.selectors';
import { proposalsActions } from '../proposals.slice';
import { ProposalDetails, ProposalsState } from '../proposals.state';

import { fetchProposalDetails } from './proposalDetails';

const mockGovernorContract = createMockedContract(
  GovernorAlpha__factory.connect(
    '0x0000000000000000000000000000000000000123',
    mockSigner
  ),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('proposals details sagas', () => {
  const reducer = combineReducers(pick(rootReducer, [Reducers.Proposals]));

  describe('fetchProposalDetails', () => {
    const mockGovernorAddress = '0x0000000000000000000000000000000000000000';
    const mockProposalGuardian = '0x0000000000000000000000000000000000000012';
    const mockProposalType = GovernorTypes.GovernorAdmin;

    const mockGovernorContracts = {
      [GovernorTypes.GovernorOwner]: 'wrongGovernorAddress',
      [mockProposalType]: mockGovernorAddress,
    };

    const mockSelectedProposal: ReturnType<typeof selectedProposalSelector> = {
      governorType: mockProposalType,
      id: '2',
      contractAddress: mockGovernorAddress,
    };

    const initialState: DeepPartial<RootState> = {
      [Reducers.Proposals]: {
        ...new ProposalsState(),
        selectedProposal: mockSelectedProposal,
      },
    };

    const mockQueryResult = {
      proposals: [
        {
          actions: [
            {
              calldata: '0x00',
              contract: '0x01',
              signature: '0x02',
            },
          ],
          description: 'test admin proposal',
          endBlock: '1000',
          proposalId: '2',
          startBlock: '900',
          startDate: '237958437',
          contractAddress: mockGovernorAddress,
          againstVotesAmount: '100000000',
          forVotesAmount: '10000000',
          eta: '4234234',
          proposer: '0x03',
          votes: [
            {
              isPro: true,
              txHash: '0x04',
              voter: '0x045',
              votes: '10000000',
            },
            {
              isPro: false,
              txHash: '0x05',
              voter: '0x046',
              votes: '100000000',
            },
          ],
        },
      ],
    } as ProposalDetailsQueryResult;

    const mockProposalState = ProposalState.Expired;

    const parsedProposal: ProposalDetails = {
      endBlock: 1000,
      endTime: 237961437,
      guardian: mockProposalGuardian,
      id: '2',
      startBlock: 900,
      startTime: 237958437,
      state: mockProposalState,
      contractAddress: mockGovernorAddress,
      title: '002 • test admin proposal',
      description: 'test admin proposal',
      proposer: '0x03',
      votes: [
        {
          isPro: true,
          txHash: '0x04',
          voter: '0x045',
          votes: '10000000',
        },
        {
          isPro: false,
          txHash: '0x05',
          voter: '0x046',
          votes: '100000000',
        },
      ],
      actions: [
        {
          calldata: '0x00',
          contract: '0x01',
          signature: '0x02',
        },
      ],
      eta: '4234234',
      againstVotesAmount: '100000000',
      forVotesAmount: '10000000',
      governorType: mockProposalType,
    };

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        proposalDetails: {
          state: 'success',
          data: parsedProposal,
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        proposalDetails: { state: 'failure', data: undefined },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchProposalDetails, {
        isError: false,
        data: mockQueryResult,
      })
        .withReducer(reducer)
        .withState(initialState)
        .select(governorContractsSelector)
        .select(selectedProposalGovernor);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(selectedProposalGovernor), mockGovernorContract],
          [matchers.select(governorContractsSelector), mockGovernorContracts],
          [
            matchers.call(mockGovernorContract.state, mockSelectedProposal.id),
            mockProposalState,
          ],
          [matchers.call(mockGovernorContract.guardian), mockProposalGuardian],
        ])
        .put(proposalsActions.fetchDetails())
        .call(mockGovernorContract.guardian)
        .call(mockGovernorContract.state, mockSelectedProposal.id)
        .put(proposalsActions.setDetails(parsedProposal))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when data is not present', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(governorContractsSelector), mockGovernorContracts],
          [matchers.select(selectedProposalGovernor), undefined],
          [
            matchers.call(mockGovernorContract.state, mockSelectedProposal.id),
            mockProposalState,
          ],
          [matchers.call(mockGovernorContract.guardian), mockProposalGuardian],
        ])
        .put(proposalsActions.fetchDetails())
        .put(proposalsActions.fetchDetailsFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('fetching state error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(selectedProposalGovernor), mockGovernorContract],
          [matchers.select(governorContractsSelector), mockGovernorContracts],
          [
            matchers.call(mockGovernorContract.state, mockSelectedProposal.id),
            throwError(),
          ],
          [matchers.call(mockGovernorContract.guardian), mockProposalGuardian],
        ])
        .put(proposalsActions.fetchDetails())
        .call(mockGovernorContract.state, mockSelectedProposal.id)
        .put(proposalsActions.fetchDetailsFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('subscription error', async () => {
      const runResult = await expectSaga(fetchProposalDetails, {
        isError: true,
        error: new Error('not working'),
      })
        .withReducer(reducer)
        .withState(initialState)
        .put(proposalsActions.fetchDetails())
        .put(proposalsActions.fetchDetailsFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
});
