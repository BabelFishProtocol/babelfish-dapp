import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { pick } from '../../../utils/helpers';
import { convertForMulticall } from '../../utils/utils.sagas';
import { GovernorTypes, ProposalState, Reducers } from '../../../constants';
import { GovernorAlpha__factory } from '../../../contracts/types';
import { rootReducer, RootState } from '../..';

import {
  mockSigner,
  createMockedContract,
  mockMulticallProvider,
} from '../../../testUtils';

import {
  governorAdminSelector,
  governorOwnerSelector,
  multicallProviderSelector,
} from '../../app/app.selectors';

import {
  ProposalListQueryItem,
  ProposalListQueryResult,
} from '../../../queries/proposalListQuery';
import { SubscriptionResponse } from '../../types';

import { parseProposals } from '../proposals.utils';
import { proposalsActions } from '../proposals.slice';
import { Proposal, ProposalsState } from '../proposals.state';
import { governorContractsSelector } from '../proposals.selectors';

import {
  fetchProposalsForContract,
  syncAllProposals,
  triggerFetchProposalsList,
} from './proposalList';

jest.mock('../../utils/utils.sagas', () => ({
  ...jest.requireActual('../../utils/utils.sagas'),
  convertForMulticall: jest.fn(),
}));

const governorAdminAddress = '0x0000000000000000000000000000000000000123';

const mockGovernorAdmin = createMockedContract(
  GovernorAlpha__factory.connect(governorAdminAddress, mockSigner),
  true
);

const governorOwnerAddress = '0x0000000000000000000000000000000000000222';

const mockGovernorOwner = createMockedContract(
  GovernorAlpha__factory.connect(governorOwnerAddress, mockSigner),
  true
);

const parsedAdminProposal: Proposal = {
  endBlock: 1000,
  endTime: 237961437,
  id: '2',
  startBlock: 900,
  startTime: 237958437,
  state: ProposalState.Active,
  contractAddress: governorAdminAddress,
  title: '002 • test admin proposal',
  governorType: GovernorTypes.GovernorAdmin,
};

const parsedOwnerProposal: Proposal = {
  endBlock: 1001,
  endTime: 237961438,
  id: '1',
  startBlock: 800,
  startTime: 237958438,
  state: ProposalState.Pending,
  contractAddress: '0x2',
  title: '001 • test owner proposal',
  governorType: GovernorTypes.GovernorOwner,
};

const adminProposal: ProposalListQueryItem = {
  createdAt: '899',
  description: 'test admin proposal',
  endBlock: '1000',
  proposalId: '2',
  startBlock: '900',
  startDate: '237958437',
  contractAddress: governorAdminAddress,
};

const ownerProposal: ProposalListQueryItem = {
  createdAt: '799',
  description: 'test owner proposal',
  endBlock: '1001',
  proposalId: '1',
  startBlock: '800',
  startDate: '237958437',
  contractAddress: governorOwnerAddress,
};

const mockAllProposals: ProposalListQueryItem[] = [
  adminProposal,
  ownerProposal,
];

const combinedProposals: Proposal[] = [
  parsedAdminProposal,
  parsedOwnerProposal,
];

afterEach(() => {
  jest.clearAllMocks();
});

describe('proposals list sagas', () => {
  const reducer = combineReducers(pick(rootReducer, [Reducers.Proposals]));

  const initialState: DeepPartial<RootState> = {
    [Reducers.Proposals]: { ...new ProposalsState() },
  };

  describe('fetchProposalsList', () => {
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

    it('both owner and admin proposals', async () => {
      const payload: SubscriptionResponse<ProposalListQueryResult> = {
        isError: false,
        data: {
          proposals: mockAllProposals,
        },
      };

      const runResult = await expectSaga(triggerFetchProposalsList, payload)
        .withReducer(reducer)
        .withState(initialState)
        .select(governorAdminSelector)
        .select(governorOwnerSelector)
        .provide([
          [matchers.select(governorAdminSelector), mockGovernorAdmin],
          [matchers.select(governorOwnerSelector), mockGovernorOwner],
          [
            matchers.call(
              fetchProposalsForContract,
              mockGovernorAdmin,
              mockAllProposals
            ),
            [parsedAdminProposal],
          ],
          [
            matchers.call(
              fetchProposalsForContract,
              mockGovernorOwner,
              mockAllProposals
            ),
            [parsedOwnerProposal],
          ],
          [matchers.call(syncAllProposals, mockAllProposals), undefined],
        ])
        .put(proposalsActions.updateProposalsList())
        .call(syncAllProposals, mockAllProposals)
        .call(fetchProposalsForContract, mockGovernorAdmin, mockAllProposals)
        .call(fetchProposalsForContract, mockGovernorOwner, mockAllProposals)
        .put(proposalsActions.setProposalsList(combinedProposals))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    describe('with only governor admin', () => {
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

      const onlyAdminPayload: SubscriptionResponse<ProposalListQueryResult> = {
        isError: false,
        data: {
          proposals: [adminProposal],
        },
      };

      const getOnlyAdminPath = () =>
        expectSaga(triggerFetchProposalsList, onlyAdminPayload)
          .withReducer(reducer)
          .withState(initialState)
          .select(governorAdminSelector)
          .select(governorOwnerSelector)
          .call(syncAllProposals, [adminProposal])
          .call(fetchProposalsForContract, mockGovernorAdmin, [adminProposal])
          .put(proposalsActions.setProposalsList([parsedAdminProposal]))
          .put(proposalsActions.updateProposalsList())
          .hasFinalState(successStateOnlyAdmin);

      it('when governorOwner is undefined', async () => {
        const runResult = await getOnlyAdminPath()
          .provide([
            [matchers.select(governorAdminSelector), mockGovernorAdmin],
            [matchers.select(governorOwnerSelector), undefined],
            [matchers.call(syncAllProposals, [adminProposal]), undefined],
            [
              matchers.call(fetchProposalsForContract, mockGovernorAdmin, [
                adminProposal,
              ]),
              [parsedAdminProposal],
            ],
          ])
          .run();

        expect(runResult.effects).toEqual({});
      });

      it('when governorOwner is same as governorAdmin', async () => {
        const runResult = await getOnlyAdminPath()
          .provide([
            [matchers.select(governorAdminSelector), mockGovernorAdmin],
            [matchers.select(governorOwnerSelector), mockGovernorAdmin],
            [matchers.call(syncAllProposals, [adminProposal]), undefined],
            [
              matchers.call(fetchProposalsForContract, mockGovernorAdmin, [
                adminProposal,
              ]),
              [parsedAdminProposal],
            ],
          ])
          .run();

        expect(runResult.effects).toEqual({});
      });
    });

    describe('fetching error', () => {
      it('queryError', async () => {
        const errorPayload: SubscriptionResponse<ProposalListQueryResult> = {
          isError: true,
          error: new Error('error'),
        };

        const runResult = await expectSaga(
          triggerFetchProposalsList,
          errorPayload
        )
          .put(proposalsActions.updateProposalsList())
          .put(proposalsActions.fetchProposalsListFailure())
          .run();

        expect(runResult.effects).toEqual({});
      });

      it('fetching status error', async () => {
        const payload: SubscriptionResponse<ProposalListQueryResult> = {
          isError: false,
          data: {
            proposals: mockAllProposals,
          },
        };

        const runResult = await expectSaga(triggerFetchProposalsList, payload)
          .withReducer(reducer)
          .withState(initialState)
          .select(governorAdminSelector)
          .select(governorOwnerSelector)
          .provide([
            [matchers.select(governorAdminSelector), mockGovernorAdmin],
            [matchers.select(governorOwnerSelector), mockGovernorOwner],
            [
              matchers.call(
                fetchProposalsForContract,
                mockGovernorAdmin,
                mockAllProposals
              ),
              throwError(new Error('error')),
            ],
            [matchers.call(syncAllProposals, mockAllProposals), undefined],
          ])
          .put(proposalsActions.updateProposalsList())
          .call(syncAllProposals, mockAllProposals)
          .call(fetchProposalsForContract, mockGovernorAdmin, mockAllProposals)
          .put(proposalsActions.fetchProposalsListFailure())
          .hasFinalState(failureState)
          .run();

        expect(runResult.effects).toEqual({});
      });
    });

    describe('fetchProposalsForContract', () => {
      const mockGovernorContracts = {
        [GovernorTypes.GovernorOwner]: 'wrongGovernorAddress',
        [GovernorTypes.GovernorAdmin]: governorAdminAddress,
      };

      const adminProposalStates = [ProposalState.Active];

      it('happy path', async () => {
        const multicallResultAdmin = {
          name: 'mocked args for governor admin multicall',
        };

        (convertForMulticall as jest.Mock).mockImplementationOnce(
          () => multicallResultAdmin
        );

        const runResult = await expectSaga(
          fetchProposalsForContract,
          mockGovernorAdmin,
          mockAllProposals
        )
          .provide([
            [matchers.select(governorContractsSelector), mockGovernorContracts],
            [matchers.select(multicallProviderSelector), mockMulticallProvider],
            [
              matchers.call(
                [mockMulticallProvider, mockMulticallProvider.all],
                [multicallResultAdmin]
              ),
              adminProposalStates,
            ],
          ])
          .select(multicallProviderSelector)
          .select(governorContractsSelector)
          .call(
            [mockMulticallProvider, mockMulticallProvider.all],
            [multicallResultAdmin]
          )
          .call(
            parseProposals,
            [adminProposal],
            adminProposalStates,
            mockGovernorContracts
          )
          .run();

        expect(runResult.effects).toEqual({});
        expect(runResult.returnValue).toEqual([parsedAdminProposal]);
      });
    });
  });
});
