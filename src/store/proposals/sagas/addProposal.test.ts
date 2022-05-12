import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';
import {
  BigNumber,
  BigNumberish,
  constants,
  ContractTransaction,
} from 'ethers';

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

import {
  governorContractsSelector,
  selectedGovernorSelector,
  selectedProposalGovernor,
  selectedProposalSelector,
} from '../proposals.selectors';
import { ProposalsActions, proposalsActions } from '../proposals.slice';
import { ProposalDetails, ProposalsState } from '../proposals.state';

import { addProposal, checkAddEligibility } from './addProposal';
import { testAccount } from '../../staking/staking.mock';
import { proposalsListQuery } from '../../../queries/proposalListQuery';

const mockGovernorContract = createMockedContract(
  GovernorAlpha__factory.connect('0x123', mockSigner),
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

  describe('addProposal', () => {
    const mockGovernorAddress = '0x0';
    const mockProposalGuardian = '0x12';
    const mockProposalType = GovernorTypes.GovernorAdmin;

    const mockGovernorContracts = {
      [GovernorTypes.GovernorOwner]: 'wrongGovernorAddress',
      [mockProposalType]: mockGovernorAddress,
    };

    const initialState: DeepPartial<RootState> = {
      [Reducers.Proposals]: {
        ...new ProposalsState(),
      },
    };

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        addProposalState: 'success',
      },
    };

    const failureWalletNotConnectedState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        addProposalState: 'failure',
        addProposalErrorReason: 'Wallet not connected',
      },
    };
    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        addProposalState: 'failure',
        addProposalErrorReason:
          'There was some error in Adding the proposal. Please try again',
      },
    };

    const proposalGovernorAdminPayload: ProposalsActions['startProposal'] = {
      payload: {
        SendProposalContract: GovernorTypes.GovernorAdmin,
        // SendProposalContract: '0x056665655DA3',
        Description: 'test description of proposal',
        Values: [
          {
            Target: '0x03f4',
            Value: '1000000000',
            Signature: 'Signature',
            Calldata: '0x616263640000',
          },
        ],
      },
      type: '',
    };

    const mockTxReceipt = { testTxReceipt: [] };
    const mockTx = {
      wait: jest.fn().mockReturnValue(mockTxReceipt),
    } as unknown as ContractTransaction;
    const getBasePath = () =>
      expectSaga(addProposal, proposalGovernorAdminPayload)
        .withReducer(reducer)
        .withState(initialState)
        .select(accountSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(
              mockGovernorContract.propose,
              [proposalGovernorAdminPayload.payload.Values[0].Target],
              [
                proposalGovernorAdminPayload.payload.Values[0].Value,
              ] as BigNumberish[],
              [proposalGovernorAdminPayload.payload.Values[0].Signature],
              [proposalGovernorAdminPayload.payload.Values[0].Calldata],
              proposalGovernorAdminPayload.payload.Description
            ),
            mockTx,
          ],
          [matchers.call(mockTx.wait), mockTxReceipt],
        ])
        .select(governorAdminSelector)
        .call(
          mockGovernorContract.propose,
          [proposalGovernorAdminPayload.payload.Values[0].Target],
          [proposalGovernorAdminPayload.payload.Values[0].Value],
          [proposalGovernorAdminPayload.payload.Values[0].Signature],
          [proposalGovernorAdminPayload.payload.Values[0].Calldata],
          proposalGovernorAdminPayload.payload.Description
        )
        .call(mockTx.wait)
        .put(proposalsActions.proposalSuccess())
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), undefined],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(
              mockGovernorContract.propose,
              [proposalGovernorAdminPayload.payload.Values[0].Target],
              [
                proposalGovernorAdminPayload.payload.Values[0].Value,
              ] as BigNumberish[],
              [proposalGovernorAdminPayload.payload.Values[0].Signature],
              [proposalGovernorAdminPayload.payload.Values[0].Calldata],
              proposalGovernorAdminPayload.payload.Description
            ),
            mockTx,
          ],
          [matchers.call(mockTx.wait), mockTxReceipt],
        ])
        .select(governorAdminSelector)
        .put(proposalsActions.proposalFailure('Wallet not connected'))
        .hasFinalState(failureWalletNotConnectedState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(
              mockGovernorContract.propose,
              [proposalGovernorAdminPayload.payload.Values[0].Target],
              [
                proposalGovernorAdminPayload.payload.Values[0].Value,
              ] as BigNumberish[],
              [proposalGovernorAdminPayload.payload.Values[0].Signature],
              [proposalGovernorAdminPayload.payload.Values[0].Calldata],
              proposalGovernorAdminPayload.payload.Description
            ),
            throwError(),
          ],
          [matchers.call(mockTx.wait), mockTxReceipt],
        ])
        .select(governorAdminSelector)
        .call(
          mockGovernorContract.propose,
          [proposalGovernorAdminPayload.payload.Values[0].Target],
          [proposalGovernorAdminPayload.payload.Values[0].Value],
          [proposalGovernorAdminPayload.payload.Values[0].Signature],
          [proposalGovernorAdminPayload.payload.Values[0].Calldata],
          proposalGovernorAdminPayload.payload.Description
        )
        .put(
          proposalsActions.proposalFailure(
            'There was some error in Adding the proposal. Please try again'
          )
        )
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
  describe('checkAddEligibility', () => {
    const mockGovernorAddress = '0x0';
    const mockProposalGuardian = '0x12';
    const mockProposalType = GovernorTypes.GovernorAdmin;

    const mockGovernorContracts = {
      [GovernorTypes.GovernorOwner]: 'wrongGovernorAddress',
      [mockProposalType]: mockGovernorAddress,
    };

    const initialState: DeepPartial<RootState> = {
      [Reducers.Proposals]: {
        ...new ProposalsState(),
      },
    };

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        addProposalState: 'success',
      },
    };

    const failureWalletNotConnectedState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        addProposalState: 'failure',
        addProposalErrorReason: 'Wallet not connected',
      },
    };
    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Proposals]: {
        ...initialState[Reducers.Proposals],
        addProposalState: 'failure',
        addProposalErrorReason:
          'There was some error in Adding the proposal. Please try again',
      },
    };

    const proposalGovernorAdminPayload: ProposalsActions['startProposal'] = {
      payload: {
        SendProposalContract: GovernorTypes.GovernorAdmin,
        // SendProposalContract: '0x056665655DA3',
        Description: 'test description of proposal',
        Values: [
          {
            Target: '0x03f4',
            Value: '1000000000',
            Signature: '0x1111111111',
            Calldata: '0x616263640000',
          },
        ],
      },
      type: '',
    };

    const adminProposalStates = [ProposalState.Pending];

    const mockTxReceipt = { testTxReceipt: [] };
    const mockTx = {
      wait: jest.fn().mockReturnValue(mockTxReceipt),
    } as unknown as ContractTransaction;
    const getBasePath = () =>
      expectSaga(checkAddEligibility)
        .withReducer(reducer)
        .withState(initialState)
        .select(accountSelector)
        .select(stakingContractSelector)
        .select(subgraphClientSelector)
        .select(multicallProviderSelector)
        .select(selectedGovernorSelector);

    const proposals = [proposalGovernorAdminPayload];
    const multicallResultAdmin = {
      name: 'mocked args for governor admin multicall',
    };

    const mockThreshold: BigNumber = BigNumber.from(5555);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(mockGovernorContract.proposalThreshold),
            mockThreshold,
          ],
          [matchers.call(mockStaking.getCurrentVotes, testAccount), 44445],
          [matchers.call(mockThreshold.gt, 44445), true],
          [
            matchers.call(proposalsListQuery, mockSubgraphClient, {
              contractAddress: mockGovernorContract.address,
            }),
            {
              proposals: [proposalGovernorAdminPayload],
            },
          ],

          // [matchers.call(fetchProposalStates, proposals, mockGovernorContract, mockMulticallProvider), {
          //   adminProposalStates,
          // }
          // ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [multicallResultAdmin]
            ),
            adminProposalStates,
          ],
        ])
        .select(governorAdminSelector)
        .call(mockGovernorContract.proposalThreshold, mockThreshold)
        .call(mockStaking.getCurrentVotes, testAccount)
        .call(mockThreshold.gt, 44445)
        .call(proposalsListQuery, mockSubgraphClient, {
          contractAddress: mockGovernorContract.address,
        })
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [multicallResultAdmin]
        )
        .put(proposalsActions.eligibleForAddProposal())
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), undefined],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(
              mockGovernorContract.propose,
              [proposalGovernorAdminPayload.payload.Values[0].Target],
              [
                proposalGovernorAdminPayload.payload.Values[0].Value,
              ] as BigNumberish[],
              [proposalGovernorAdminPayload.payload.Values[0].Signature],
              [proposalGovernorAdminPayload.payload.Values[0].Calldata],
              proposalGovernorAdminPayload.payload.Description
            ),
            mockTx,
          ],
          [matchers.call(mockTx.wait), mockTxReceipt],
        ])
        .select(governorAdminSelector)
        .put(proposalsActions.proposalFailure('Wallet not connected'))
        .hasFinalState(failureWalletNotConnectedState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(governorAdminSelector), mockGovernorContract],
          [
            matchers.call(
              mockGovernorContract.propose,
              [proposalGovernorAdminPayload.payload.Values[0].Target],
              [
                proposalGovernorAdminPayload.payload.Values[0].Value,
              ] as BigNumberish[],
              [proposalGovernorAdminPayload.payload.Values[0].Signature],
              [proposalGovernorAdminPayload.payload.Values[0].Calldata],
              proposalGovernorAdminPayload.payload.Description
            ),
            throwError(),
          ],
          [matchers.call(mockTx.wait), mockTxReceipt],
        ])
        .select(governorAdminSelector)
        .call(
          mockGovernorContract.propose,
          [proposalGovernorAdminPayload.payload.Values[0].Target],
          [proposalGovernorAdminPayload.payload.Values[0].Value],
          [proposalGovernorAdminPayload.payload.Values[0].Signature],
          [proposalGovernorAdminPayload.payload.Values[0].Calldata],
          proposalGovernorAdminPayload.payload.Description
        )
        .put(
          proposalsActions.proposalFailure(
            'There was some error in Adding the proposal. Please try again'
          )
        )
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
});
