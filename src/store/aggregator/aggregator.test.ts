import { constants } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { getCurrentTimestamp, pick } from '../../utils/helpers';
import { Reducers } from '../../constants';
import {
  AllowTokens__factory,
  Bridge__factory,
  ERC20__factory,
} from '../../contracts/types';
import { rootReducer, RootState } from '..';

import { createMockedContract, mockSigner } from '../../testUtils';

import {
  addTransactionIntoLocalStorage,
  fetchAllowTokenAddress,
  fetchBridgeFeesAndLimits,
  fetchStartingTokenBalance,
} from './aggregator.sagas';
import { aggregatorActions, aggregatorReducer } from './aggregator.slice';
import {
  AggregatorCalls,
  AggregatorState,
  TxDetails,
  XusdLocalTransaction,
} from './aggregator.state';
import {
  allowTokensContractSelector,
  bridgeContractSelector,
  startingTokenContractSelector,
  startingTokenSelector,
  submitCallCurrentOperation,
  submitTxDetails,
  tokenAddressSelector,
} from './aggregator.selectors';
import { accountSelector } from '../app/app.selectors';
import { GetSuccesState, GetTxDetails, StepData } from '../types';
import { AppState } from '../app/app.state';
import { appActions, appReducer } from '../app/app.slice';

const mockBridge = createMockedContract(
  Bridge__factory.connect(constants.AddressZero, mockSigner),
  true
);

const mockAllowTokens = createMockedContract(
  AllowTokens__factory.connect(constants.AddressZero, mockSigner),
  true
);

const mockToken = createMockedContract(
  ERC20__factory.connect(constants.AddressZero, mockSigner),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('aggregator store', () => {
  const reducer = combineReducers(pick(rootReducer, [Reducers.Aggregator]));

  let initialState: DeepPartial<RootState> = {
    [Reducers.Aggregator]: { ...new AggregatorState() },
  };

  describe('fetchBridgeData', () => {
    const allowTokensAddress = '0x10892374akb23xz0q9w8q6123dcasedq21345as0';

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        allowTokensAddress: {
          state: 'success',
          data: allowTokensAddress,
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        allowTokensAddress: {
          state: 'failure',
          data: undefined,
        },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchAllowTokenAddress)
        .withReducer(reducer)
        .withState(initialState)
        .select(bridgeContractSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(bridgeContractSelector), mockBridge],
          [matchers.call.fn(mockBridge.allowTokens), allowTokensAddress],
        ])
        .call(mockBridge.allowTokens)
        .put(aggregatorActions.setAllowTokensAddress(allowTokensAddress))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      await getBasePath()
        .provide([[matchers.select(bridgeContractSelector), undefined]])
        .put(aggregatorActions.fetchAllowTokensAddressFailure())
        .hasFinalState(failureState)
        .run();

      expect(mockBridge.allowTokens).not.toHaveBeenCalled();
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(bridgeContractSelector), mockBridge],
          [matchers.call.fn(mockBridge.allowTokens), throwError()],
        ])
        .call(mockBridge.allowTokens)
        .put(aggregatorActions.fetchAllowTokensAddressFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('fetchBridgeFeesAndLimits', () => {
    const testStartingToken = 'USDT';
    const testStartingTokenAddress =
      '0xdAC17F958D2ee523a2206206994597C13D831ec7';

    const bridgeFee = '0x29a2241af62c0000';
    const minTransfer = '0x1a055690d9db80000';
    const maxTransfer = '0xd3c21bcecceda1000000';
    const dailyLimit = '0x84595161401484a000000';

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        feesAndLimits: {
          state: 'success',
          data: {
            bridgeFee,
            minTransfer,
            maxTransfer,
            dailyLimit,
          },
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        feesAndLimits: {
          state: 'failure',
          data: {},
        },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchBridgeFeesAndLimits)
        .withReducer(reducer)
        .withState(initialState)
        .select(allowTokensContractSelector)
        .select(startingTokenSelector)
        .select(tokenAddressSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(allowTokensContractSelector), mockAllowTokens],
          [matchers.select(startingTokenSelector), testStartingToken],
          [matchers.select(tokenAddressSelector), testStartingTokenAddress],
          [matchers.call.fn(mockAllowTokens.getFeePerToken), bridgeFee],
          [matchers.call.fn(mockAllowTokens.getMinPerToken), minTransfer],
          [matchers.call.fn(mockAllowTokens.getMaxTokensAllowed), maxTransfer],
          [matchers.call.fn(mockAllowTokens.dailyLimit), dailyLimit],
        ])
        .put(aggregatorActions.fetchFeesAndLimitsLoading())
        .call(
          mockAllowTokens.getFeePerToken,
          testStartingTokenAddress.toLowerCase()
        )
        .call(
          mockAllowTokens.getMinPerToken,
          testStartingTokenAddress.toLowerCase()
        )
        .call(mockAllowTokens.getMaxTokensAllowed)
        .call(mockAllowTokens.dailyLimit)
        .put(
          aggregatorActions.setFeesAndLimits({
            bridgeFee,
            minTransfer,
            maxTransfer,
            dailyLimit,
          })
        )
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      await getBasePath()
        .provide([
          [matchers.select(allowTokensContractSelector), undefined],
          [matchers.select(startingTokenSelector), testStartingToken],
          [matchers.select(tokenAddressSelector), testStartingTokenAddress],
        ])
        .put(
          aggregatorActions.fetchFeesAndLimitsFailure(
            'Not enough data to fetch bridge fees'
          )
        )
        .hasFinalState({
          ...failureState,
          [Reducers.Aggregator]: {
            ...failureState[Reducers.Aggregator],
            fetchFeesAndLimitsErrorReason:
              'Not enough data to fetch bridge fees',
          },
        })
        .run();

      expect(mockAllowTokens.getFeePerToken).not.toHaveBeenCalled();
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(allowTokensContractSelector), mockAllowTokens],
          [matchers.select(startingTokenSelector), testStartingToken],
          [matchers.select(tokenAddressSelector), testStartingTokenAddress],
          [matchers.call.fn(mockAllowTokens.getFeePerToken), throwError()],
        ])
        .put(aggregatorActions.fetchFeesAndLimitsLoading())
        .call(
          mockAllowTokens.getFeePerToken,
          testStartingTokenAddress.toLowerCase()
        )
        .put(
          aggregatorActions.fetchFeesAndLimitsFailure(
            'There was some error in fetching fees and limits. Please try again'
          )
        )
        .hasFinalState({
          ...failureState,
          [Reducers.Aggregator]: {
            ...failureState[Reducers.Aggregator],
            fetchFeesAndLimitsErrorReason:
              'There was some error in fetching fees and limits. Please try again',
          },
        })
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('fetchStartingTokenBalance', () => {
    const testAccount = '0x0123';
    const testStartingTokenBalance = '0x232347482374623';

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        startingTokenBalance: {
          state: 'success',
          data: testStartingTokenBalance,
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        startingTokenBalance: {
          state: 'failure',
          data: undefined,
        },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchStartingTokenBalance)
        .withReducer(reducer)
        .withState(initialState)
        .select(accountSelector)
        .select(startingTokenContractSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(startingTokenContractSelector), mockToken],
          [matchers.call.fn(mockToken.balanceOf), testStartingTokenBalance],
        ])
        .put(aggregatorActions.fetchStartingTokenBalanceLoading())
        .call(mockToken.balanceOf, testAccount)
        .put(
          aggregatorActions.setStartingTokenBalance(testStartingTokenBalance)
        )
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });
    it('when wallet not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), undefined],
          [matchers.select(startingTokenContractSelector), mockToken],
          [matchers.call.fn(mockToken.balanceOf), testStartingTokenBalance],
        ])
        .put(
          aggregatorActions.fetchStartingTokenBalanceFailure(
            'Please connect wallet first'
          )
        )
        .hasFinalState({
          ...failureState,
          [Reducers.Aggregator]: {
            ...failureState[Reducers.Aggregator],
            fetchStartingTokenBalanceErrorReason: 'Please connect wallet first',
          },
        })
        .run();

      expect(runResult.effects).toEqual({});
    });
    it('when call throws an error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(startingTokenContractSelector), mockToken],
          [matchers.call.fn(mockToken.balanceOf), throwError()],
        ])
        .put(aggregatorActions.fetchStartingTokenBalanceLoading())
        .call(mockToken.balanceOf, testAccount)
        .put(
          aggregatorActions.fetchStartingTokenBalanceFailure(
            'Could not fetch starting token balance'
          )
        )
        .hasFinalState({
          ...failureState,
          [Reducers.Aggregator]: {
            ...failureState[Reducers.Aggregator],
            fetchStartingTokenBalanceErrorReason:
              'Could not fetch starting token balance',
          },
        })
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('adding transactions into local storage', () => {
    const mockAccount = '0x6d';
    const mockTxHash = '0x0';
    const mockAmount = '2000000';
    const mockChainEnum = 31;
    const mockTimestamp = 1000;
    const mockTimestampString = mockTimestamp.toString();
    const mockReducer = combineReducers({
      app: appReducer,
      aggregator: aggregatorReducer,
    });

    initialState = {
      [Reducers.Aggregator]: { ...new AggregatorState() },
      [Reducers.App]: {
        ...new AppState(),
        chainId: mockChainEnum,
        account: mockAccount,
        xusdLocalTransactions: {},
      },
    };

    const getSuccessState = ({
      txToSave,
      alreadyConfirmed = false,
    }: GetSuccesState): DeepPartial<RootState> => ({
      ...initialState,
      [Reducers.App]: {
        ...initialState[Reducers.App],
        xusdLocalTransactions: {
          [mockChainEnum]: {
            [mockAccount]: alreadyConfirmed
              ? [{ ...txToSave, status: 'Confirmed' }]
              : [txToSave],
          },
        },
      },
    });

    const getTxDetails = ({
      event,
      status,
      isCrossChain = undefined,
    }: GetTxDetails): TxDetails => ({
      amount: mockAmount,
      user: mockAccount,
      event,
      status,
      isCrossChain,
    });

    const getTxToSave = (txDetails: TxDetails): XusdLocalTransaction => ({
      txHash: mockTxHash,
      asset: 'XUSD',
      date: mockTimestampString,
      ...txDetails,
    });

    const getBasePath = (mockTx: StepData<AggregatorCalls>) =>
      expectSaga(
        addTransactionIntoLocalStorage,
        aggregatorActions.setSubmitStepData(mockTx)
      )
        .withReducer(mockReducer)
        .withState(initialState)
        .select(submitCallCurrentOperation)
        .select(submitTxDetails);

    const mockTx = {
      tx: {
        hash: mockTxHash,
      },
    } as StepData<AggregatorCalls>;

    describe('not cross chain transactions', () => {
      const basePath = () => getBasePath(mockTx);

      it('deposit - happy path', async () => {
        const mockCurrOpperation: AggregatorCalls = 'deposit';
        const txDetails = getTxDetails({
          event: 'Deposit',
          status: 'Pending',
        });

        const txToSave = getTxToSave(txDetails);
        const successState = getSuccessState({ txToSave });

        const runResult = await basePath()
          .provide([
            [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
            [matchers.select(submitTxDetails), txDetails],
            [matchers.call(getCurrentTimestamp), mockTimestamp],
          ])
          .call(getCurrentTimestamp)
          .put(appActions.setLocalXusdTransactions(txToSave))
          .hasFinalState(successState)
          .run();

        expect(runResult.effects).toEqual({});
      });

      it('withdraw - happy path', async () => {
        const mockCurrOpperation: AggregatorCalls = 'withdraw';
        const txDetails = getTxDetails({
          event: 'Withdraw',
          status: 'Pending',
        });

        const txToSave = getTxToSave(txDetails);
        const successState = getSuccessState({ txToSave });

        const runResult = await basePath()
          .provide([
            [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
            [matchers.select(submitTxDetails), txDetails],
            [matchers.call(getCurrentTimestamp), mockTimestamp],
          ])
          .call(getCurrentTimestamp)
          .put(appActions.setLocalXusdTransactions(txToSave))
          .hasFinalState(successState)
          .run();

        expect(runResult.effects).toEqual({});
      });

      it('return on difference in event vs currentOperation', async () => {
        const mockCurrOpperation: AggregatorCalls = 'withdraw';

        const txDetails = getTxDetails({
          event: 'Deposit', // not withdraw
          status: 'Pending',
        });

        const runResult = await basePath()
          .provide([
            [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
            [matchers.select(submitTxDetails), txDetails],
          ])
          .hasFinalState(initialState)
          .run();

        expect(runResult.effects).toEqual({});
      });

      it('return on approve as currentOperation', async () => {
        const mockCurrOpperation: AggregatorCalls = 'approve';
        const txDetails = getTxDetails({
          event: 'Deposit',
          status: 'Pending',
        });

        const runResult = await basePath()
          .provide([
            [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
            [matchers.select(submitTxDetails), txDetails],
          ])
          .hasFinalState(initialState)
          .run();

        expect(runResult.effects).toEqual({});
      });

      it('return on reset allowance as currentOperation', async () => {
        const mockCurrOpperation: AggregatorCalls = 'reset allowance';
        const txDetails = getTxDetails({
          event: 'Deposit',
          status: 'Pending',
        });

        const runResult = await basePath()
          .provide([
            [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
            [matchers.select(submitTxDetails), txDetails],
          ])
          .hasFinalState(initialState)
          .run();

        expect(runResult.effects).toEqual({});
      });
    });

    describe('cross chain transactions', () => {
      const mockTxWithTxReceipt = {
        ...mockTx,
        txReceipt: {
          transactionHash: mockTxHash,
        },
      } as StepData<AggregatorCalls>;

      const basePath = ({ withTxReceipt = false }) =>
        withTxReceipt ? getBasePath(mockTxWithTxReceipt) : getBasePath(mockTx);

      it('deposit - happy path', async () => {
        const mockCurrOpperation: AggregatorCalls = 'deposit';

        const txDetails = getTxDetails({
          event: 'Deposit',
          status: 'Confirmed',
          isCrossChain: 'true',
        });

        const txToSave = getTxToSave(txDetails);
        const successState = getSuccessState({ txToSave });

        const runResult = await basePath({ withTxReceipt: true })
          .provide([
            [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
            [matchers.select(submitTxDetails), txDetails],
            [matchers.call(getCurrentTimestamp), mockTimestamp],
          ])
          .call(getCurrentTimestamp)
          .put(appActions.setLocalXusdTransactions(txToSave))
          .hasFinalState(successState)
          .run();

        expect(runResult.effects).toEqual({});
      });

      it('deposit - happy path, with proper status changing', async () => {
        const mockCurrOpperation: AggregatorCalls = 'deposit';

        const txDetails = getTxDetails({
          event: 'Deposit',
          status: 'Pending',
          isCrossChain: 'true',
        });

        const txToSave = getTxToSave(txDetails);
        const successState = getSuccessState({
          txToSave,
          alreadyConfirmed: true,
        });

        const txAlreadyConfirmed: XusdLocalTransaction = {
          ...txToSave,
          status: 'Confirmed',
        };

        const runResult = await basePath({ withTxReceipt: true })
          .provide([
            [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
            [matchers.select(submitTxDetails), txDetails],
            [matchers.call(getCurrentTimestamp), mockTimestamp],
          ])
          .call(getCurrentTimestamp)
          .put(appActions.setLocalXusdTransactions(txAlreadyConfirmed))
          .hasFinalState(successState)
          .run();

        expect(runResult.effects).toEqual({});
      });

      it('withdraw - happy path', async () => {
        const mockCurrOpperation: AggregatorCalls = 'withdraw';

        const txDetails = getTxDetails({
          event: 'Withdraw',
          status: 'Pending',
          isCrossChain: 'true',
        });

        const txToSave = getTxToSave(txDetails);
        const successState = getSuccessState({ txToSave });

        const runResult = await basePath({ withTxReceipt: false })
          .provide([
            [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
            [matchers.select(submitTxDetails), txDetails],
            [matchers.call(getCurrentTimestamp), mockTimestamp],
          ])
          .call(getCurrentTimestamp)
          .put(appActions.setLocalXusdTransactions(txToSave))
          .hasFinalState(successState)
          .run();

        expect(runResult.effects).toEqual({});
      });

      it('return on difference in event vs currentOperation', async () => {
        const mockCurrOpperation: AggregatorCalls = 'withdraw';

        const txDetails = getTxDetails({
          event: 'Deposit',
          status: 'Pending',
          isCrossChain: 'true',
        });

        const runResult = await basePath({ withTxReceipt: false })
          .provide([
            [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
            [matchers.select(submitTxDetails), txDetails],
          ])
          .hasFinalState(initialState)
          .run();

        expect(runResult.effects).toEqual({});
      });
    });
  });

  describe('local storage transactions - reducerTest', () => {
    const initial: AggregatorState = {
      ...new AggregatorState(),
    };

    it('sets proper txDetails', async () => {
      const txDetails: TxDetails = {
        amount: '71573896800000000000',
        user: '0x6d66e98984e10D62A09983b6B1B26485979b4788',
        event: 'Deposit',
        status: 'Pending',
      };

      const action = aggregatorActions.setTransactionDetails(txDetails);

      const successState: AggregatorState = {
        ...initial,
        txDetails,
      };

      const checkReducerState = (expected: AggregatorState) => {
        expect(aggregatorReducer(initial, action)).toEqual(expected);
      };

      checkReducerState(successState);
    });
  });

  describe('selectors', () => {
    it('submitCallCurrentOperation', async () => {
      const filledCurrentOperation: AggregatorState['submitCall'] = {
        steps: [...new AggregatorState().submitCall.steps],
        status: 'idle',
        currentOperation: 'approve',
      };

      const filledDataResult = submitCallCurrentOperation.resultFunc(
        filledCurrentOperation
      );

      expect(filledDataResult).toEqual('approve');
    });

    it('submitTxDetails', async () => {
      const txDetails: TxDetails = {
        amount: '71573896800000000000',
        user: '0x6d66e98984e10D62A09983b6B1B26485979b4788',
        event: 'Deposit',
        status: 'Pending',
      };

      const filledState: AggregatorState = {
        ...new AggregatorState(),
        txDetails,
      };

      const filledDataResult = submitTxDetails.resultFunc(filledState);

      expect(filledDataResult).toEqual(txDetails);
    });
  });
});
