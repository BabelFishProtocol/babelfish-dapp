import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';
import util from 'util';
import { pick } from '../../../utils/helpers';
import { Reducers } from '../../../constants';
import { rootReducer, RootState } from '../..';

import { mockSubgraphClient } from '../../../testUtils';

import {
  accountSelector,
  subgraphClientSelector,
} from '../../app/app.selectors';

import { dashboardActions } from '../dashboard.slice';
import { DashboardState } from '../dashboard.state';
import {
  expectedTransactions,
  expectedTxWithStatus,
} from './fetchTransactions.mock';
import { fetchTransactions } from './fetchTransactions';
import { transactionsQuery } from '../../../queries/transactionsQuery';
import {
  AggregatorState,
  XusdLocalTransaction,
} from '../../aggregator/aggregator.state';
import { AppState } from '../../app/app.state';
import { appActions } from '../../app/app.slice';

// TODO add to 'global testing'a
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
  const mockTxHash = '0x0';
  const mockAmount = '2000000';
  const mockTimestamp = 1000;
  const mockTimestampString = mockTimestamp.toString();

  const initialState: DeepPartial<RootState> = {
    [Reducers.App]: { ...new AppState() },
    [Reducers.Dashboard]: { ...new DashboardState() },
    [Reducers.Aggregator]: { ...new AggregatorState() },
  };

  describe('fetchTransactions without local ones', () => {
    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Dashboard]: {
        ...initialState[Reducers.Dashboard],
        transactionList: {
          state: 'success',
          data: expectedTxWithStatus,
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
        .put(appActions.removeLocalXusdTransactions(expectedTxWithStatus))
        .put(dashboardActions.setTransactions(expectedTxWithStatus))
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

  describe('fetchTransactions with local ones', () => {
    const txSaved: XusdLocalTransaction = {
      user: mockAccount,
      amount: mockAmount,
      txHash: mockTxHash,
      asset: 'XUSD',
      date: mockTimestampString,
      event: 'Deposit',
      status: 'Pending',
    };

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Dashboard]: {
        ...initialState[Reducers.Dashboard],
        transactionList: {
          state: 'success',
          data: [txSaved],
        },
      },
      [Reducers.App]: {
        ...new AppState(),
        chainId: mockChainEnum,
        account: mockAccount,
        xusdLocalTransactions: {
          [mockChainEnum]: {
            [mockAccount]: [],
          },
        },
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
        .put(
          dashboardActions.setTransactions(
            expectedTransactions.xusdTransactions.map((tx) => ({
              status: 'Confirmed',
              ...tx,
            }))
          )
        )
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
});
