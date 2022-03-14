import { all, fork } from 'typed-redux-saga';
import { appSaga } from './app/app.sagas';
import { propsalSaga } from './proposal/proposal.sagas';
import { stakingSaga } from './staking/staking.sagas';

export function* indexSaga() {
  yield* all([fork(appSaga), fork(stakingSaga), fork(propsalSaga)]);
}
