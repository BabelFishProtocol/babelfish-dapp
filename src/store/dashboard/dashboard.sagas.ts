import { all, takeLatest } from 'typed-redux-saga';
import { setFailedTransactionStatus } from '../aggregator/sagas/localTransactions';
import { dashboardActions } from './dashboard.slice';
import {
  fetchDashboardBalances,
  watchDashboardBalances,
} from './sagas/fetchDashboardBalances';
import {
  fetchTransactions,
  watchTransactions,
} from './sagas/fetchTransactions';

export function* dashboardSaga() {
  yield* all([
    takeLatest(dashboardActions.fetchBalances.type, fetchDashboardBalances),
    takeLatest(dashboardActions.updateBalances.type, fetchDashboardBalances),
    takeLatest(dashboardActions.watchBalances.type, watchDashboardBalances),

    takeLatest(dashboardActions.fetchTransactions.type, fetchTransactions),
    takeLatest(dashboardActions.updateTransactions.type, fetchTransactions),
    takeLatest(dashboardActions.watchTransactions.type, watchTransactions),

    takeLatest(
      dashboardActions.setTransactions.type,
      setFailedTransactionStatus
    ),
  ]);
}
