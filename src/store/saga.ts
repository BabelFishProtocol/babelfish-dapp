import { all, fork } from 'typed-redux-saga';
import { aggregatorSaga } from './aggregator/aggregator.sagas';
import { appSaga } from './app/app.sagas';
import { dashboardSaga } from './dashboard/sagas/dashboard.sagas';
import { watchTransactions } from './dashboard/sagas/transactions.sagas';
import { proposalsSaga } from './proposals/proposals.sagas';
import { stakingSaga } from './staking/staking.sagas';
import { vestingSaga } from './vesting/vesting.sagas';

export function* indexSaga() {
  yield* all([
    fork(appSaga),
    fork(stakingSaga),
    fork(aggregatorSaga),
    fork(proposalsSaga),
    fork(vestingSaga),
    fork(dashboardSaga),
    fork(watchTransactions),
  ]);
}
