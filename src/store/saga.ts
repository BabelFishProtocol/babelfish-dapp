import { all, fork } from 'typed-redux-saga';
import { aggregatorSaga } from './aggregator/aggregator.sagas';
import { appSaga } from './app/app.sagas';
import { stakingSaga } from './staking/staking.sagas';

export function* indexSaga() {
  yield* all([fork(appSaga), fork(stakingSaga), fork(aggregatorSaga)]);
}
