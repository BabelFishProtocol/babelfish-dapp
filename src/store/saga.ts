import { all, fork } from 'typed-redux-saga';
import { appSaga } from './app/app.sagas';
import { proposalsSaga } from './proposals/proposals.sagas';
import { stakingSaga } from './staking/staking.sagas';

export function* indexSaga() {
  yield* all([fork(appSaga), fork(stakingSaga), fork(proposalsSaga)]);
}
