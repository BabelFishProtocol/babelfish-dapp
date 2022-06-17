import { expectSaga } from 'redux-saga-test-plan';
import util from 'util';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';
import { getCurrentTimestamp, pick } from '../../../utils/helpers';
import { Reducers } from '../../../constants';
import { rootReducer, RootState } from '../..';

import { mockSubgraphClient } from '../../../testUtils';

import {
  accountSelector,
  providerSelector,
  subgraphClientSelector,
  xusdLocalTransactionsSelector,
} from '../../app/app.selectors';

import { dashboardActions } from '../dashboard.slice';
import { DashboardState } from '../dashboard.state';
import {
  changeTxStatus,
  txWithChangedHash,
  diffTxsWithHash,
  expectedTransactions,
} from './fetchTransactions.mock';
import { fetchTransactions } from './fetchTransactions';
import { transactionsQuery } from '../../../queries/transactionsQuery';
import {
  AggregatorCalls,
  AggregatorState,
  XusdLocalTransaction,
} from '../../aggregator/aggregator.state';
import { AppState } from '../../app/app.state';
import { appActions } from '../../app/app.slice';
import {
  GetInitialState,
  GetSuccesState,
  TxReceiptStatus,
} from './fetchTransactions.types';
import {
  submitCallCurrentOperation,
  submitTxDetails,
} from '../../aggregator/aggregator.selectors';
import {
  setFailedOnDepositCrossChainTx,
  setFailedTransactionStatus,
} from '../../aggregator/sagas/localTransactions';
import { IEvent } from '../../../gql/graphql';

util.inspect.defaultOptions.depth = null;

afterEach(() => {
  jest.clearAllMocks();
});

describe('dashboard store', () => {
  const reducer = combineReducers(
    pick(rootReducer, [Reducers.Dashboard, Reducers.App, Reducers.Aggregator])
  );

  const mockAccount = '0x6d';
  const mockChainEnum = 31;

  describe('fetchTransactions w/o local tx', () => {
    const initialState: DeepPartial<RootState> = {
      [Reducers.App]: { ...new AppState() },
      [Reducers.Dashboard]: { ...new DashboardState() },
      [Reducers.Aggregator]: { ...new AggregatorState() },
    };

    const expectedConfirmedTx = changeTxStatus('Confirmed');

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Dashboard]: {
        ...initialState[Reducers.Dashboard],
        transactionList: {
          state: 'success',
          data: expectedConfirmedTx,
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Dashboard]: {
        ...initialState[Reducers.Dashboard],
        transactionList: { state: 'failure', data: [] },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchTransactions)
        .withReducer(reducer)
        .withState(initialState)
        .select(subgraphClientSelector)
        .select(accountSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(accountSelector), mockAccount],
          [matchers.call.fn(transactionsQuery), expectedTransactions],
        ])
        .call(transactionsQuery, mockSubgraphClient, { user: mockAccount })
        .put(appActions.removeLocalXusdTransactions(expectedConfirmedTx))
        .put(dashboardActions.setTransactions(expectedConfirmedTx))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(subgraphClientSelector), undefined],
          [matchers.select(accountSelector), mockAccount],
        ])
        .put(dashboardActions.fetchTransactionsFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(accountSelector), mockAccount],
          [matchers.call.fn(transactionsQuery), throwError()],
        ])
        .call(transactionsQuery, mockSubgraphClient, { user: mockAccount })
        .put(dashboardActions.fetchTransactionsFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('fetchTransactions with swappng local tx', () => {
    const getInitialState = ({ localTx }: GetInitialState) => ({
      [Reducers.Dashboard]: { ...new DashboardState() },
      [Reducers.Aggregator]: { ...new AggregatorState() },
      [Reducers.App]: {
        ...new AppState(),
        chainId: mockChainEnum,
        account: mockAccount,
        xusdLocalTransactions: {
          [mockChainEnum]: {
            [mockAccount]: localTx,
          },
        },
      },
    });

    const getSuccessState = ({
      initialState,
      fetchedTx,
      localTx,
    }: GetSuccesState) => ({
      ...initialState,
      [Reducers.App]: {
        ...initialState[Reducers.App],
        xusdLocalTransactions: {
          [mockChainEnum]: {
            [mockAccount]: localTx,
          },
        },
      },
      [Reducers.Dashboard]: {
        ...initialState[Reducers.Dashboard],
        transactionList: fetchedTx
          ? {
              state: 'success',
              data: fetchedTx,
            }
          : {
              state: 'idle',
              data: [],
            },
      },
    });

    class MockProvider {
      public status: number = TxReceiptStatus.Failed;
      waitForTransaction(_: string) {
        return {
          txReceipt: this.status,
        };
      }
    }

    const mockProvider = new MockProvider();

    it('swap single transaction', async () => {
      const fetchedTx = expectedTransactions.xusdTransactions[0];
      const localBeforeTx: XusdLocalTransaction = changeTxStatus('Pending')[0];
      const localAfterTx: XusdLocalTransaction = changeTxStatus('Confirmed')[0];

      const initialState = getInitialState({ localTx: [localBeforeTx] });
      const successState = getSuccessState({
        fetchedTx: [localAfterTx],
        localTx: [],
        initialState,
      });

      const getBasePath = () =>
        expectSaga(fetchTransactions)
          .withReducer(reducer)
          .withState(initialState)
          .select(subgraphClientSelector)
          .select(accountSelector);

      const runResult = await getBasePath()
        .provide([
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(accountSelector), mockAccount],
          [
            matchers.call.fn(transactionsQuery),
            { xusdTransactions: [fetchedTx] },
          ],
        ])
        .call(transactionsQuery, mockSubgraphClient, { user: mockAccount })
        .put(appActions.removeLocalXusdTransactions([localAfterTx]))
        .put(dashboardActions.setTransactions([localAfterTx]))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('swap three transactions', async () => {
      const fetchedTx = expectedTransactions.xusdTransactions;
      const localBeforeTx = changeTxStatus('Pending');
      const localAfterTx = changeTxStatus('Confirmed');

      const initialState = getInitialState({ localTx: localBeforeTx });
      const successState = getSuccessState({
        initialState,
        fetchedTx: localAfterTx,
        localTx: [],
      });

      const getBasePath = () =>
        expectSaga(fetchTransactions)
          .withReducer(reducer)
          .withState(initialState)
          .select(subgraphClientSelector)
          .select(accountSelector);

      const runResult = await getBasePath()
        .provide([
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(accountSelector), mockAccount],
          [
            matchers.call.fn(transactionsQuery),
            { xusdTransactions: fetchedTx },
          ],
        ])
        .call(transactionsQuery, mockSubgraphClient, { user: mockAccount })
        .put(appActions.removeLocalXusdTransactions(localAfterTx))
        .put(dashboardActions.setTransactions(localAfterTx))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('delete from local transactions only with same txHash', async () => {
      const fetchedTx = expectedTransactions.xusdTransactions;
      const fetchedAfterTx = changeTxStatus('Confirmed');

      const localBeforeTx = changeTxStatus('Pending', txWithChangedHash);
      const localAfterTx = diffTxsWithHash(localBeforeTx, fetchedTx);

      const initialState = getInitialState({ localTx: localBeforeTx });
      const successState = getSuccessState({
        initialState,
        fetchedTx: fetchedAfterTx,
        localTx: localAfterTx,
      });

      const getBasePath = () =>
        expectSaga(fetchTransactions)
          .withReducer(reducer)
          .withState(initialState)
          .select(subgraphClientSelector)
          .select(accountSelector);

      const runResult = await getBasePath()
        .provide([
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(accountSelector), mockAccount],
          [
            matchers.call.fn(transactionsQuery),
            { xusdTransactions: fetchedTx },
          ],
        ])
        .call(transactionsQuery, mockSubgraphClient, { user: mockAccount })
        .put(appActions.removeLocalXusdTransactions(fetchedAfterTx))
        .put(dashboardActions.setTransactions(fetchedAfterTx))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('check seting new status: Failed; not on deposit, crossChain', async () => {
      const localBeforeTx = changeTxStatus('Pending');
      const localAfterTx = changeTxStatus('Failed');

      const initialState = getInitialState({ localTx: localBeforeTx });
      const successState = getSuccessState({
        initialState,
        localTx: localAfterTx,
      });

      const getBasePath = () =>
        expectSaga(setFailedTransactionStatus)
          .withReducer(reducer)
          .withState(initialState)
          .select(providerSelector)
          .select(xusdLocalTransactionsSelector);

      const runResult = await getBasePath()
        .provide([
          [matchers.select(providerSelector), mockProvider],
          [matchers.select(xusdLocalTransactionsSelector), localBeforeTx],
          [matchers.call.fn(mockProvider.waitForTransaction), { status: 0 }],
        ])
        .put(
          appActions.updateLocalXusdTransactionStatus({
            txHash: localBeforeTx[0].txHash,
            newStatus: 'Failed',
          })
        )
        .put(
          appActions.updateLocalXusdTransactionStatus({
            txHash: localBeforeTx[1].txHash,
            newStatus: 'Failed',
          })
        )
        .put(
          appActions.updateLocalXusdTransactionStatus({
            txHash: localBeforeTx[2].txHash,
            newStatus: 'Failed',
          })
        )
        .call(
          [mockProvider, mockProvider.waitForTransaction],
          localBeforeTx[0].txHash
        )
        .call(
          [mockProvider, mockProvider.waitForTransaction],
          localBeforeTx[1].txHash
        )
        .call(
          [mockProvider, mockProvider.waitForTransaction],
          localBeforeTx[2].txHash
        )
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('check seting new status: Failed; on deposit, crossChain', async () => {
      const mockCurrOpperation: AggregatorCalls = 'deposit';

      const localBeforeTx: XusdLocalTransaction = {
        event: IEvent.Deposit,
        asset: 'XUSD',
        amount: '49500',
        user: '0x0123',
        date: '1636084223',
        txHash: '0x0',
        isCrossChain: 'true',
        status: 'Pending',
      };

      const mockTimestamp = localBeforeTx.date;

      const localAfterTx: XusdLocalTransaction = {
        ...localBeforeTx,
        status: 'Failed',
      };

      const initialState = getInitialState({ localTx: [] });
      const successState = getSuccessState({
        initialState,
        localTx: [localAfterTx],
      });

      const getBasePath = () =>
        expectSaga(setFailedOnDepositCrossChainTx)
          .withReducer(reducer)
          .withState(initialState)
          .select(submitCallCurrentOperation)
          .select(submitTxDetails);

      const runResult = await getBasePath()
        .provide([
          [matchers.select(submitCallCurrentOperation), mockCurrOpperation],
          [matchers.select(submitTxDetails), localBeforeTx],
          [matchers.call(getCurrentTimestamp), mockTimestamp],
        ])
        .call(getCurrentTimestamp)
        .put(appActions.setLocalXusdTransactions(localAfterTx))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
});
