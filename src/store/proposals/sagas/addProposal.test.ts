import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';
import { BigNumber, constants, ContractTransaction } from 'ethers';

import { TransactionReceipt } from '@ethersproject/providers';
import { pick } from '../../../utils/helpers';
import { GovernorTypes, ProposalState, Reducers } from '../../../constants';
import {
  GovernorAlpha__factory,
  Staking__factory,
} from '../../../contracts/types';
import { rootReducer, RootState } from '../..';

import {
  mockSigner,
  createMockedContract,
  mockSubgraphClient,
  mockMulticallProvider,
} from '../../../testUtils';

import {
  accountSelector,
  governorAdminSelector,
  multicallProviderSelector,
  stakingContractSelector,
  subgraphClientSelector,
} from '../../app/app.selectors';

import { selectedGovernorSelector } from '../proposals.selectors';
import { proposalsActions } from '../proposals.slice';
import { ProposalsState } from '../proposals.state';

import { addProposal, checkAddEligibility } from './addProposal';
import { testAccount } from '../../staking/staking.mock';
import { userProposalsListQuery } from '../../../queries/proposalListQuery';
import { convertForMulticall } from '../../utils/utils.sagas';
import { AddProposalFields } from '../../../pages/AddProposal/AddProposal.types';

jest.mock('../../utils/utils.sagas', () => ({
  ...jest.requireActual('../../utils/utils.sagas'),
  convertForMulticall: jest.fn(),
}));

const mockGovernorContract = createMockedContract(
  GovernorAlpha__factory.connect(
    '0x0000000000000000000000000000000000000123',
    mockSigner
  ),
  true
);

const mockStaking = createMockedContract(
  Staking__factory.connect(constants.AddressZero, mockSigner),
  false
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('add proposal sagas', () => {
  const reducer = combineReducers(pick(rootReducer, [Reducers.Proposals]));
  const initialState: DeepPartial<RootState> = {
    [Reducers.Proposals]: {
      ...new ProposalsState(),
    },
  };

  const mockAddProposalValues: AddProposalFields = {
    SendProposalContract: GovernorTypes.GovernorAdmin,
    Description: 'test description of proposal',
    Values: [
      {
        Target: '0x00000000000000000000000000000000000003f4',
        Value: '1000000000',
        Signature: '0x00000011',
        Calldata: '0x616263640000',
      },
    ],
  };

  describe('addProposal', () => {
    const initialSteps =
      initialState[Reducers.Proposals]?.addProposalCall?.steps;

    const mockTx = {
      hash: '0x01',
      wait: jest.fn() as ContractTransaction['wait'],
    } as ContractTransaction;

    const mockTxReceipt = {
      transactionHash: '0x01',
    } as TransactionReceipt;

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        addProposalCall: {
          status: 'success',
          currentOperation: 'propose',
          steps: [
            {
              ...initialSteps?.[0],
              tx: mockTx,
              txReceipt: mockTxReceipt,
            },
          ],
        },
      },
    };
    const errorMsg = 'An unexpected error has occurred. Please try again';

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        addProposalCall: {
          status: 'failure',
          steps: [
            {
              ...initialSteps?.[0],
              error: errorMsg,
            },
          ],
          currentOperation: 'propose',
        },
      },
    };

    const failureWalletNotConnectedState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        addProposalCall: {
          status: 'failure',
          steps: [
            {
              ...initialSteps?.[0],
              error: 'Wallet not connected',
            },
          ],
        },
      },
    };

    const getBasePath = () =>
      expectSaga(
        addProposal,
        proposalsActions.addProposal(mockAddProposalValues)
      )
        .withReducer(reducer)
        .withState(initialState)
        .select(accountSelector);

    it('happy path', async () => {
      await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [matchers.call.fn(mockGovernorContract.propose), mockTx],
          [matchers.call(mockTx.wait), mockTxReceipt],
        ])
        .select(governorAdminSelector)
        .call.fn(mockGovernorContract.propose)
        .hasFinalState(successState)
        .run();
    });

    it('when wallet is not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), undefined],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [matchers.call.fn(mockGovernorContract.propose), mockTx],
          [matchers.call(mockTx.wait), mockTxReceipt],
        ])
        .select(governorAdminSelector)
        .put(proposalsActions.setAddProposalError('Wallet not connected'))
        .hasFinalState(failureWalletNotConnectedState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [matchers.call.fn(mockGovernorContract.propose), throwError()],
        ])
        .select(governorAdminSelector)
        .call.fn(mockGovernorContract.propose)
        .put(
          proposalsActions.setAddProposalStatus({
            status: 'loading',
          })
        )
        .put(
          proposalsActions.setAddProposalStatus({
            currentOperation: 'propose',
          })
        )
        .put(
          proposalsActions.setAddProposalError(
            'An unexpected error has occurred. Please try again'
          )
        )
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
  describe('checkAddEligibility', () => {
    const multicallResult = {
      name: 'mocked args for multicall',
    };

    (convertForMulticall as jest.Mock).mockImplementation(
      () => multicallResult
    );

    const addProposalStates = [ProposalState.Canceled];

    const mockThreshold = BigNumber.from(555555555544455);
    const mockVotes = BigNumber.from(4555555555544455);

    const mockSelectedGovernor = GovernorTypes.GovernorAdmin;

    const getBasePath = () =>
      expectSaga(checkAddEligibility)
        .withReducer(reducer)
        .withState(initialState)
        .select(accountSelector)
        .select(stakingContractSelector)
        .select(subgraphClientSelector)
        .select(multicallProviderSelector)
        .select(selectedGovernorSelector);

    it('happy path', async () => {
      const successState: DeepPartial<RootState> = {
        ...initialState,
        [Reducers.Proposals]: {
          ...initialState[Reducers.Proposals],
          reasonToBlockProposal: undefined,
        },
      };
      await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.select(selectedGovernorSelector), mockSelectedGovernor],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(mockGovernorContract.proposalThreshold),
            mockThreshold,
          ],
          [matchers.call(mockStaking.getCurrentVotes, testAccount), mockVotes],
          [
            matchers.call(userProposalsListQuery, mockSubgraphClient, {
              contractAddress: mockGovernorContract.address,
              proposerAddress: testAccount,
            }),
            {
              proposals: [mockAddProposalValues],
            },
          ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [multicallResult]
            ),
            addProposalStates,
          ],
        ])
        .select(governorAdminSelector)
        .call(mockGovernorContract.proposalThreshold)
        .call(mockStaking.getCurrentVotes, testAccount)
        .call(userProposalsListQuery, mockSubgraphClient, {
          contractAddress: mockGovernorContract.address,
          proposerAddress: testAccount,
        })
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [multicallResult]
        )
        .put(proposalsActions.eligibleForAddProposal())
        .hasFinalState(successState)
        .run();
    });

    it('when user has a live proposal', async () => {
      const liveProposalErrorState: DeepPartial<RootState> = {
        ...initialState,
        [Reducers.Proposals]: {
          ...initialState[Reducers.Proposals],
          reasonToBlockProposal:
            'You already have a live proposal. You cannot add another one at this time',
        },
      };
      const existingProposalStates = [ProposalState.Pending];

      await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.select(selectedGovernorSelector), mockSelectedGovernor],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(mockGovernorContract.proposalThreshold),
            mockThreshold,
          ],
          [matchers.call(mockStaking.getCurrentVotes, testAccount), mockVotes],
          [
            matchers.call(userProposalsListQuery, mockSubgraphClient, {
              contractAddress: mockGovernorContract.address,
              proposerAddress: testAccount,
            }),
            {
              proposals: [mockAddProposalValues],
            },
          ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [multicallResult]
            ),
            existingProposalStates,
          ],
        ])
        .select(governorAdminSelector)
        .call(mockGovernorContract.proposalThreshold)
        .call(mockStaking.getCurrentVotes, testAccount)
        .call(userProposalsListQuery, mockSubgraphClient, {
          contractAddress: mockGovernorContract.address,
          proposerAddress: testAccount,
        })
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [multicallResult]
        )
        .put(
          proposalsActions.notEligibleForAddProposal(
            'You already have a live proposal. You cannot add another one at this time'
          )
        )
        .hasFinalState(liveProposalErrorState)
        .run();
    });

    it('when wallet is not connected', async () => {
      const walletErrorState: DeepPartial<RootState> = {
        ...initialState,
        [Reducers.Proposals]: {
          ...initialState[Reducers.Proposals],
          reasonToBlockProposal: 'Wallet not connected',
        },
      };
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), undefined],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.select(selectedGovernorSelector), mockSelectedGovernor],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(mockGovernorContract.proposalThreshold),
            mockThreshold,
          ],
          [matchers.call(mockStaking.getCurrentVotes, testAccount), mockVotes],
          [
            matchers.call(userProposalsListQuery, mockSubgraphClient, {
              contractAddress: mockGovernorContract.address,
              proposerAddress: testAccount,
            }),
            {
              proposals: [mockAddProposalValues],
            },
          ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [multicallResult]
            ),
            addProposalStates,
          ],
        ])
        .select(governorAdminSelector)
        .put(proposalsActions.notEligibleForAddProposal('Wallet not connected'))
        .hasFinalState(walletErrorState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when threshold is bigger then votes', async () => {
      const mockLowerVotes = BigNumber.from(45555555554445);
      const thresholdErrorState: DeepPartial<RootState> = {
        ...initialState,
        [Reducers.Proposals]: {
          ...initialState[Reducers.Proposals],
          reasonToBlockProposal:
            'Your voting power must be at least 0.0005 to make a proposal',
        },
      };

      await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.select(selectedGovernorSelector), mockSelectedGovernor],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(mockGovernorContract.proposalThreshold),
            mockThreshold,
          ],
          [
            matchers.call(mockStaking.getCurrentVotes, testAccount),
            mockLowerVotes,
          ],
          [
            matchers.call(userProposalsListQuery, mockSubgraphClient, {
              contractAddress: mockGovernorContract.address,
              proposerAddress: testAccount,
            }),
            {
              proposals: [mockAddProposalValues],
            },
          ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [multicallResult]
            ),
            addProposalStates,
          ],
        ])
        .select(governorAdminSelector)
        .call(mockGovernorContract.proposalThreshold)
        .call(mockStaking.getCurrentVotes, testAccount)
        .put(
          proposalsActions.notEligibleForAddProposal(
            'Your voting power must be at least 0.0005 to make a proposal'
          )
        )
        .hasFinalState(thresholdErrorState)
        .run();
    });

    it('fetching error', async () => {
      const failureState: DeepPartial<RootState> = {
        ...initialState,
        [Reducers.Proposals]: {
          ...initialState[Reducers.Proposals],
          reasonToBlockProposal:
            'You cannot add the proposal right now. Please try again later',
        },
      };

      await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.select(selectedGovernorSelector), mockSelectedGovernor],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [matchers.call(mockGovernorContract.proposalThreshold), throwError()],
          [matchers.call(mockStaking.getCurrentVotes, testAccount), mockVotes],
          [
            matchers.call(userProposalsListQuery, mockSubgraphClient, {
              contractAddress: mockGovernorContract.address,
              proposerAddress: testAccount,
            }),
            {
              proposals: [mockAddProposalValues],
            },
          ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [multicallResult]
            ),
            addProposalStates,
          ],
        ])
        .select(governorAdminSelector)
        .call(mockGovernorContract.proposalThreshold)
        .put(
          proposalsActions.notEligibleForAddProposal(
            'You cannot add the proposal right now. Please try again later'
          )
        )
        .hasFinalState(failureState)
        .run();
    });
  });
});
