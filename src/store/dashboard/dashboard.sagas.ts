import { all, takeLatest } from 'typed-redux-saga';
import { dashboardActions } from './dashboard.slice';
import {
  fetchDashboardBalances,
  watchDashboardBalances,
} from './sagas/dashboardBalances.sagas';
import {
  fetchTransactions,
  watchTransactions,
} from './sagas/transactions.sagas';

export function* dashboardSaga() {
  yield* all([
    takeLatest(dashboardActions.fetchBalances.type, fetchDashboardBalances),
    takeLatest(dashboardActions.updateBalances.type, fetchDashboardBalances),
    takeLatest(dashboardActions.watchBalances.type, watchDashboardBalances),

    takeLatest(dashboardActions.fetchTransactions.type, fetchTransactions),
    takeLatest(dashboardActions.updateTransactions.type, fetchTransactions),
    takeLatest(dashboardActions.watchTransactions.type, watchTransactions),
  ]);
}
