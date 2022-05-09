import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
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
import { expectedTransactions } from './fetchTransactinos.mock';
import { fetchTransactions } from './fetchTransactions';
import { transactionsQuery } from '../../../queries/transactionsQuery';

jest.mock('../../utils/utils.sagas', () => ({
  ...jest.requireActual('../../utils/utils.sagas'),
  convertForMulticall: jest.fn(),
}));

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

    const getBasePath = () =>
      expectSaga(fetchTransactions)
        .withReducer(reducer)
        .withState(initialState)
        .select(subgraphClientSelector)
        .select(accountSelector);

    it('happy path', async () => {
      await getBasePath()
        .provide([
          [matchers.select(subgraphClientSelector), mockSubgraphClient],
          [matchers.select(accountSelector), testAccount],
          [matchers.call.fn(transactionsQuery), expectedTransactions],
        ])
        .call(transactionsQuery, mockSubgraphClient, { user: testAccount })
        .put(
          dashboardActions.setTransactions(
            expectedTransactions.xusdTransactions
          )
        )
        .hasFinalState(successState)
        .run();
    });
  });
});
