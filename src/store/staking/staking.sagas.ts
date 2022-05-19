import { all, put, call, takeLatest } from 'typed-redux-saga';

import { createWatcherSaga } from '../utils/utils.sagas';

import { stakingActions } from './staking.slice';
import { addNewStake } from './sagas/addNewStake';
import { extendStake } from './sagas/extendStake';
import { increaseStake } from './sagas/increaseStake';
import { delegateStake } from './sagas/delegateStake';
import { withdrawStake } from './sagas/withdrawStake';
import { watchStakingHistory } from './sagas/fetchHistoryStaking';
import { fetchStakesList } from './sagas/fetchStakesList';
import { fetchVotingPower } from './sagas/fetchVotingPower';
import { fetchStakeConstants } from './sagas/fetchStakeConstants';
import { fetchFishTokenData } from './sagas/fetchFishTokenData';

/** Fetch data needed for the stake page */
function* fetchBalances() {
  yield* all([
    call(fetchFishTokenData),
    call(fetchStakeConstants),
    call(fetchVotingPower),
    call(fetchStakesList),
  ]);
}

/** Update values that can potentially be changed after user actions */
function* updateBalances() {
  yield* all([
    call(fetchFishTokenData),
    call(fetchVotingPower),
    call(fetchStakesList),
  ]);
}

function* triggerUpdate() {
  yield* put(stakingActions.updateStakingData());
}

function* triggerFetch() {
  yield* put(stakingActions.fetchStakingData());
}

const watchStaking = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: stakingActions.stopWatchingStakingData.type,
});

export function* stakingSaga() {
  yield* all([
    takeLatest(stakingActions.addNewStake.type, addNewStake),
    takeLatest(stakingActions.increaseStake.type, increaseStake),
    takeLatest(stakingActions.extendStake.type, extendStake),
    takeLatest(stakingActions.delegateStake.type, delegateStake),
    takeLatest(stakingActions.withdrawStake.type, withdrawStake),
    takeLatest(stakingActions.fetchStakingData.type, fetchBalances),
    takeLatest(stakingActions.updateStakingData.type, updateBalances),
    takeLatest(stakingActions.watchStakingData.type, watchStaking),
    takeLatest(stakingActions.watchHistoryStakesList.type, watchStakingHistory),
  ]);
}
