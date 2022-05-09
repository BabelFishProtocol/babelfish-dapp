import { all, takeLatest } from 'typed-redux-saga';
import { delegateVest } from './sagas/delegateVest';
import { fetchVestsList, watchVesting } from './sagas/fetchVestsList';
import { withdrawVest } from './sagas/withdrawVest';
import { vestingActions } from './vesting.slice';

export function* vestingSaga() {
  yield* all([
    takeLatest(vestingActions.delegateVest.type, delegateVest),
    takeLatest(vestingActions.withdrawVest.type, withdrawVest),
    takeLatest(vestingActions.fetchVestingData.type, fetchVestsList),
    takeLatest(vestingActions.updateVestingData.type, fetchVestsList),
    takeLatest(vestingActions.watchVestingData.type, watchVesting),
  ]);
}
