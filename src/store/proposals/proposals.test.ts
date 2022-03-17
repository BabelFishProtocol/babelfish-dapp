import { expectSaga } from 'redux-saga-test-plan';
import { GraphQLClient } from 'graphql-request';
import * as matchers from 'redux-saga-test-plan/matchers';
import { Provider as MulticallProvider } from 'ethers-multicall';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

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
import { fetchProposalsList } from './proposals.sagas';
import { Proposal, ProposalsState } from './proposals.state';

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

  describe('fetchProposalsList', () => {
    const mockAdminProposalsQueryResult: ProposalListQueryResult = {
      proposals: [
        {
          description: 'test admin proposal',
          endBlock: '1000',
          proposalId: '2',
          startBlock: '900',
          startDate: '237958437',
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
    };

    const mockOwnerProposalsQueryResult: ProposalListQueryResult = {
      proposals: [
        {
          description: 'test owner proposal',
          endBlock: '1001',
          proposalId: '1',
          startBlock: '901',
          startDate: '237958438',
        },
      ],
    };

    const ownerProposalStates = [ProposalState.Active];

    const expectedParsedOwnerProposal: Proposal = {
      endBlock: 1001,
      endTime: 237961438,
      id: '1',
      startBlock: 901,
      startTime: 237958438,
      state: ownerProposalStates[0],
      title: '001 • test owner proposal',
    };

    const combinedProposals: Proposal[] = [
      expectedParsedOwnerProposal,
      expectedParsedAdminProposal,
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
      const multicallResultAdmin = {
        name: 'mocked args for governor admin multicall',
      };
      const multicallResultOwner = {
        name: 'mocked args for governor owner multicall',
      };

      (convertForMulticall as jest.Mock)
        .mockImplementationOnce(() => multicallResultAdmin)
        .mockImplementationOnce(() => multicallResultOwner);

      const runResult = await getBasePath()
        .provide([
          [matchers.select(governorAdminSelector), mockGovernorAdmin],
          [matchers.select(governorOwnerSelector), mockGovernorOwner],
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
          [
            matchers.call(proposalsListQuery, mockSubgraphClient, {
              contractAddress: mockGovernorOwner.address,
            }),
            mockOwnerProposalsQueryResult,
          ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [multicallResultOwner]
            ),
            ownerProposalStates,
          ],
        ])
        .select(subgraphClientSelector)
        .select(subgraphClientSelector)
        .select(multicallProviderSelector)
        .select(multicallProviderSelector)
        .select(providerSelector)
        .select(providerSelector)
        .call(proposalsListQuery, mockSubgraphClient, {
          contractAddress: mockGovernorAdmin.address,
        })
        .call(proposalsListQuery, mockSubgraphClient, {
          contractAddress: mockGovernorOwner.address,
        })
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [multicallResultAdmin]
        )
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [multicallResultOwner]
        )
        .call(
          parseProposals,
          mockAdminProposalsQueryResult.proposals,
          adminProposalStates
        )
        .call(
          parseProposals,
          mockOwnerProposalsQueryResult.proposals,
          ownerProposalStates
        )
        .put(proposalsActions.setProposalsList(combinedProposals))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    // it('when wallet is not connected', async () => {
    //   await getBasePath()
    //     .provide([
    //       [matchers.select(accountSelector), testAccount],
    //       [matchers.select(stakingContractSelector), mockStaking],
    //       [matchers.select(providerSelector), mockProvider],
    //       [matchers.select(vestingRegistrySelector), undefined],
    //     ])
    //     .put(stakingActions.fetchVestsListFailure())
    //     .hasFinalState(failureState)
    //     .run();

    //   expect(mockVestingRegistry.getVesting).not.toHaveBeenCalled();
    //   expect(mockVestingRegistry.getTeamVesting).not.toHaveBeenCalled();
    // });

    // it('fetching error', async () => {
    //   await getBasePath()
    //     .provide([
    //       [matchers.select(accountSelector), testAccount],
    //       [matchers.select(stakingContractSelector), mockStaking],
    //       [matchers.select(vestingRegistrySelector), mockVestingRegistry],
    //       [matchers.select(providerSelector), mockProvider],
    //       [matchers.call.fn(mockVestingRegistry.getVesting), throwError()],
    //     ])
    //     .call(mockVestingRegistry.getVesting, testAccount)
    //     .put(stakingActions.fetchVestsListFailure())
    //     .hasFinalState(failureState)
    //     .run();
    // });
  });
});
