import { combineReducers } from '@reduxjs/toolkit';
import * as matchers from 'redux-saga-test-plan/matchers';
import { DeepPartial } from 'react-hook-form';
import { expectSaga } from 'redux-saga-test-plan';
import { RootState } from '../..';
import { Reducers } from '../../../constants';
import { getCurrentTimestamp } from '../../../utils/helpers';
import { appActions, appReducer } from '../../app/app.slice';
import { AppState } from '../../app/app.state';
import { GetSuccesState, GetTxDetails, StepData } from '../../types';
import {
  submitCallCurrentOperation,
  submitTxDetails,
} from '../aggregator.selectors';
import { aggregatorActions, aggregatorReducer } from '../aggregator.slice';
import {
  AggregatorCalls,
  AggregatorState,
  TxDetails,
  XusdLocalTransaction,
} from '../aggregator.state';
import { addTransactionIntoLocalStorage } from './localTransactions';

afterEach(() => {
  jest.clearAllMocks();
});

describe('aggregator store', () => {
  let initialState: DeepPartial<RootState> = {
    [Reducers.Aggregator]: { ...new AggregatorState() },
  };

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
      },
    };

    const getSuccessState = ({
      txToSave,
      addConfirmedTx = false,
    }: GetSuccesState): DeepPartial<RootState> => ({
      ...initialState,
      [Reducers.App]: {
        ...initialState[Reducers.App],
        xusdLocalTransactions: {
          [mockChainEnum]: {
            [mockAccount]: addConfirmedTx
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
          addConfirmedTx: true,
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
});
