import {
  all,
  put,
  call,
  fork,
  take,
  cancel,
  select,
  takeLatest,
} from 'typed-redux-saga';
import { appActions } from '../app/app.slice';
import { proposalsActions } from './proposals.slice';

export function* fetchProposalsList() {
  try {
    // yield* put(proposalsActions.setProposalsList());
    console.log('jestem w sadze');
  } catch (e) {
    yield* put(proposalsActions.fetchProposalsListFailure());
  }
}

function* triggerUpdate() {
  yield* put(proposalsActions.fetchProposalsList());
}

function* runUpdater() {
  yield* put(proposalsActions.fetchProposalsList());

  yield* takeLatest(
    [
      appActions.setChainId.type,
      appActions.setAccount.type,
      appActions.setBlockNumber.type,
    ],
    triggerUpdate
  );
}

function* watchProposalsData() {
  const updaterTask = yield* fork(runUpdater);

  yield* take(proposalsActions.stopWatchingProposalsList.type);

  yield* cancel(updaterTask);
}

export function* proposalsSaga() {
  yield* all([
    takeLatest(proposalsActions.fetchProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.watchProposalsList.type, watchProposalsData),
  ]);
}
