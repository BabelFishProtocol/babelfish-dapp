import { all, takeLatest } from 'typed-redux-saga';
import { fetchVestsList, watchVesting } from './sagas/fetchVestsList';
import { vestingActions } from './vesting.slice';

export function* vestingSaga() {
  yield* all([
    takeLatest(vestingActions.fetchVestingData.type, fetchVestsList),
    takeLatest(vestingActions.updateVestingData.type, fetchVestsList),
    takeLatest(vestingActions.watchVestingData.type, watchVesting),
  ]);
}
