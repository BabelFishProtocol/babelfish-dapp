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
import { accountSelector, stakingContractSelector } from '../app/app.selectors';
import { appActions } from '../app/app.slice';
import { stakingActions } from './staking.slice';

export function* fetchTotalStaked() {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);

    if (!staking || !account) {
      throw new Error('Wallet not connected');
    }

    const totalStaked = yield* call(staking.balanceOf, account);

    yield* put(stakingActions.setTotalStaked(totalStaked.toString()));
  } catch (e) {
    yield* put(stakingActions.fetchTotalStakedFailure());
  }
}

export function* fetchKickoffTs() {
  try {
    const staking = yield* select(stakingContractSelector);

    if (!staking) {
      throw new Error('Wallet not connected');
    }

    const kickoffTS = yield* call(staking.kickoffTS);

    yield* put(stakingActions.setKickoffTs(kickoffTS.toNumber()));
  } catch (e) {
    yield* put(stakingActions.fetchKickoffTsFailure());
  }
}

export function* fetchVotingPower() {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);

    if (!staking || !account) {
      throw new Error('Wallet not connected');
    }

    const votingPower = yield* call(staking.getCurrentVotes, account);

    yield* put(stakingActions.setVotingPower(votingPower.toString()));
  } catch (e) {
    yield* put(stakingActions.fetchVotingPowerFailure());
  }
}

function* fetchBalances() {
  yield* all([
    call(fetchTotalStaked),
    call(fetchKickoffTs),
    call(fetchVotingPower),
  ]);
}

function* runBalancesUpdater() {
  yield* put(stakingActions.fetchStakingData());

  while (true) {
    yield* take(appActions.setBlockNumber.type);

    yield* put(stakingActions.fetchStakingData());
  }
}

function* watchStakingData() {
  const updaterTask = yield* fork(runBalancesUpdater);

  yield* take(stakingActions.stopWatchingStakingData.type);

  yield* cancel(updaterTask);
}

export function* stakingSaga() {
  yield* all([
    takeLatest(stakingActions.fetchStakingData.type, fetchBalances),
    takeLatest(stakingActions.watchStakingData.type, watchStakingData),
  ]);
}
