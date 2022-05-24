import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

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
import { expectedTransactions } from './fetchTransactions.mock';
import { fetchTransactions } from './fetchTransactions';
import { transactionsQuery } from '../../../queries/transactionsQuery';

afterEach(() => {
  jest.clearAllMocks();
});

describe('dashboard store', () => {
  const reducer = combineReducers(pick(rootReducer, [Reducers.Dashboard]));

  const testAccount = '0x0123';

  const initialState: DeepPartial<RootState> = {
    [Reducers.Dashboard]: { ...new DashboardState() },
  };

  describe('fetchTransactions', () => {
    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Dashboard]: {
        ...initialState[Reducers.Dashboard],
        transactionList: {
          state: 'success',
          data: expectedTransactions.xusdTransactions,
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
          [matchers.select(accountSelector), testAccount],
          [matchers.call.fn(transactionsQuery), expectedTransactions],
        ])
        .call(transactionsQuery, mockSubgraphClient, { user: testAccount })
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

    it('when wallet is not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(subgraphClientSelector), undefined],
          [matchers.select(accountSelector), testAccount],
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
          [matchers.select(accountSelector), testAccount],
          [matchers.call.fn(transactionsQuery), throwError()],
        ])
        .call(transactionsQuery, mockSubgraphClient, { user: testAccount })
        .put(dashboardActions.fetchTransactionsFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
});
