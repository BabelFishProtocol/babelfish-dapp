import { expectSaga } from 'redux-saga-test-plan';
import { GraphQLClient } from 'graphql-request';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { Provider as MulticallProvider } from 'ethers-multicall';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { utils } from 'ethers';
import { pick } from '../../utils/helpers';
import { convertForMulticall } from '../utils';
import { ProposalState, Reducers } from '../../constants';
import { GovernorAlpha__factory } from '../../contracts/types';
import { rootReducer, RootState } from '..';

import {
  createMockedContract,
  mockSigner,
  mockProvider,
} from '../../testUtils';

import {
  governorAdminSelector,
  governorOwnerSelector,
  multicallProviderSelector,
  providerSelector,
  subgraphClientSelector,
} from '../app/app.selectors';

import {
  ProposalListQueryResult,
  proposalsListQuery,
} from '../../queries/proposalListQuery';

import { parseProposals } from './proposals.utils';
import { proposalsActions } from './proposals.slice';

import { Proposal, ProposalDetails, ProposalsState } from './proposals.state';
import {
  fetchProposalsForContract,
  fetchProposalsList,
} from './sagas/proposalList';
import { votesRatioSelector } from './proposals.selectors';

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  convertForMulticall: jest.fn(),
}));

const mockMulticallProvider: MulticallProvider = {
  init: jest.fn(),
  all: jest.fn(),
  getEthBalance: jest.fn(),
} as unknown as MulticallProvider;

const mockSubgraphClient: GraphQLClient = {
  request: jest.fn(),
} as unknown as GraphQLClient;

const governorAdminAddress = '0x123';

const mockGovernorAdmin = createMockedContract(
  GovernorAlpha__factory.connect(governorAdminAddress, mockSigner),
  true
);

const governorOwnerAddress = '0x222';

const mockGovernorOwner = createMockedContract(
  GovernorAlpha__factory.connect(governorOwnerAddress, mockSigner),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('proposals store', () => {
  const reducer = combineReducers(pick(rootReducer, [Reducers.Proposals]));

  const initialState: DeepPartial<RootState> = {
    [Reducers.Proposals]: { ...new ProposalsState() },
  };

  describe('proposal selectors', () => {
    it('returns undefined when there is no data', () => {
      const emptyDataResult = votesRatioSelector.resultFunc(true, {
        state: 'failure',
        data: undefined,
      });

      expect(emptyDataResult).toBeUndefined();

      const noVotesProposal: DeepPartial<ProposalDetails> = {
        votes: [],
        forVotesAmount: '0',
        againstVotesAmount: '0',
      };

      const noVotesResult = votesRatioSelector.resultFunc(false, {
        state: 'success',
        data: noVotesProposal as ProposalDetails,
      });

      expect(noVotesResult).toBeUndefined();
    });

    it('returns 100 when there are no against proposals', () => {
      const proposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: '10',
        againstVotesAmount: '0',
      };

      const result = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: proposal as ProposalDetails,
      });

      expect(result).toBe(100);
    });

    it('properly calculates ratio', () => {
      const winningProposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: '9999900',
        againstVotesAmount: '1112200',
      };

      const winningProposalRatio = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: winningProposal as ProposalDetails,
      });

      expect(winningProposalRatio.toFixed(2)).toBe('89.99');

      const beatenProposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: '550000',
        againstVotesAmount: '3567800',
      };

      const beatenProposalRatio = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: beatenProposal as ProposalDetails,
      });

      expect(beatenProposalRatio.toFixed(2)).toBe('13.36');
    });

    it('works fine with big numbers', () => {
      const winningProposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: utils.parseEther('100000.5').toString(),
        againstVotesAmount: utils.parseEther('50000.5').toString(),
      };

      const winningProposalRatio = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: winningProposal as ProposalDetails,
      });

      expect(winningProposalRatio.toFixed(2)).toBe('66.67');

      const beatenProposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: utils.parseEther('500').toString(),
        againstVotesAmount: utils.parseEther('1500').toString(),
      };

      const beatenProposalRatio = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: beatenProposal as ProposalDetails,
      });

      expect(beatenProposalRatio.toFixed(2)).toBe('25.00');
    });
  });

  describe('fetchProposalsList', () => {
    const parsedAdminProposal: Proposal = {
      endBlock: 1000,
      endTime: 237961437,
      id: '2',
      startBlock: 900,
      startTime: 237958437,
      state: ProposalState.Active,
      contractAddress: '0x1',
      title: '002 • test admin proposal',
    };

    const parsedOwnerProposal: Proposal = {
      endBlock: 1001,
      endTime: 237961438,
      id: '1',
      startBlock: 901,
      startTime: 237958438,
      state: ProposalState.Pending,
      contractAddress: '0x2',
      title: '001 • test owner proposal',
    };

    const combinedProposals: Proposal[] = [
      parsedOwnerProposal,
      parsedAdminProposal,
    ];

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        proposalsList: { state: 'success', data: combinedProposals },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        proposalsList: { state: 'failure', data: [] },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchProposalsList)
        .withReducer(reducer)
        .withState(initialState)
        .select(governorAdminSelector)
        .select(governorOwnerSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(governorAdminSelector), mockGovernorAdmin],
          [matchers.select(governorOwnerSelector), mockGovernorOwner],
          [
            matchers.call(fetchProposalsForContract, mockGovernorAdmin),
            [parsedAdminProposal],
          ],
          [
            matchers.call(fetchProposalsForContract, mockGovernorOwner),
            [parsedOwnerProposal],
          ],
        ])
        .call(fetchProposalsForContract, mockGovernorAdmin)
        .call(fetchProposalsForContract, mockGovernorOwner)
        .put(proposalsActions.setProposalsList(combinedProposals))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('does not try to get owner proposals when governorOwner is undefined or same as governorAdmin', async () => {
      const successStateOnlyAdmin: DeepPartial<RootState> = {
        ...successState,
        [Reducers.Proposals]: {
          ...successState[Reducers.Proposals],
          proposalsList: {
            ...successState[Reducers.Proposals]?.proposalsList,
            data: [parsedAdminProposal],
          },
        },
      };

      const getOnlyAdminPath = () =>
        getBasePath()
          .call(fetchProposalsForContract, mockGovernorAdmin)
          .put(proposalsActions.setProposalsList([parsedAdminProposal]))
          .hasFinalState(successStateOnlyAdmin);

      const { effects: undefinedOwnerEffects } = await getOnlyAdminPath()
        .provide([
          [matchers.select(governorAdminSelector), mockGovernorAdmin],
          [matchers.select(governorOwnerSelector), undefined],
          [
            matchers.call(fetchProposalsForContract, mockGovernorAdmin),
            [parsedAdminProposal],
          ],
        ])
        .run();

      expect(undefinedOwnerEffects).toEqual({});

      const { effects: duplicatedGovernorsEffects } = await getOnlyAdminPath()
        .provide([
          [matchers.select(governorAdminSelector), mockGovernorAdmin],
          [matchers.select(governorOwnerSelector), mockGovernorAdmin],
          [
            matchers.call(fetchProposalsForContract, mockGovernorAdmin),
            [parsedAdminProposal],
          ],
        ])
        .run();

      expect(duplicatedGovernorsEffects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(governorAdminSelector), undefined],
          [matchers.select(governorOwnerSelector), undefined],
        ])
        .put(proposalsActions.fetchProposalsListFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(governorAdminSelector), mockGovernorAdmin],
          [matchers.select(governorOwnerSelector), mockGovernorOwner],
          [
            matchers.call(fetchProposalsForContract, mockGovernorAdmin),
            throwError(),
          ],
          [
            matchers.call(fetchProposalsForContract, mockGovernorOwner),
            [parsedOwnerProposal],
          ],
        ])
        .call(fetchProposalsForContract, mockGovernorAdmin)
        .put(proposalsActions.fetchProposalsListFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('fetchProposalsForContract', () => {
    const mockAdminProposalsQueryResult: ProposalListQueryResult = {
      proposals: [
        {
          description: 'test admin proposal',
          endBlock: '1000',
          proposalId: '2',
          startBlock: '900',
          startDate: '237958437',
          contractAddress: '0x0',
        },
      ],
    };

    const adminProposalStates = [ProposalState.Active];

    const expectedParsedAdminProposal: Proposal = {
      endBlock: 1000,
      endTime: 237961437,
      id: '2',
      startBlock: 900,
      startTime: 237958437,
      state: adminProposalStates[0],
      title: '002 • test admin proposal',
      contractAddress: '0x0',
    };

    it('happy path', async () => {
      const multicallResultAdmin = {
        name: 'mocked args for governor admin multicall',
      };

      (convertForMulticall as jest.Mock).mockImplementationOnce(
        () => multicallResultAdmin
      );

      const runResult = await expectSaga(
        fetchProposalsForContract,
        mockGovernorAdmin
      )
        .provide([
          [matchers.select(providerSelector), mockProvider],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [
            matchers.call(proposalsListQuery, mockSubgraphClient, {
              contractAddress: mockGovernorAdmin.address,
            }),
            mockAdminProposalsQueryResult,
          ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [multicallResultAdmin]
            ),
            adminProposalStates,
          ],
        ])
        .select(providerSelector)
        .select(multicallProviderSelector)
        .select(subgraphClientSelector)
        .call(proposalsListQuery, mockSubgraphClient, {
          contractAddress: mockGovernorAdmin.address,
        })
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [multicallResultAdmin]
        )
        .call(
          parseProposals,
          mockAdminProposalsQueryResult.proposals,
          adminProposalStates
        )
        .run();

      expect(runResult.effects).toEqual({});
      expect(runResult.returnValue).toEqual([expectedParsedAdminProposal]);
    });
  });
});
