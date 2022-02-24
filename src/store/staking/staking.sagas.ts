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
import { StakeListItem } from './staking.state';

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

export function* fetchStakesList() {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);

    if (!staking || !account) {
      throw new Error('Wallet not connected');
    }

    const { stakes, dates } = yield* call(staking.getStakes, account);

    const delegates = yield* all(
      dates.map((date) => call(staking.delegates, account, date.toNumber()))
    );

    const stakesList: StakeListItem[] = dates.map((date, index) => ({
      asset: 'FISH',
      unlockDate: date.toNumber(),
      votingDelegation: delegates[index],
      lockedAmount: stakes[index].toString(),
    }));

    yield* put(stakingActions.setStakesList(stakesList));
  } catch (e) {
    yield* put(stakingActions.fetchStakesListFailure());
  }
}

export function* fetchFishBalance() {}

function* fetchBalances() {
  yield* all([
    call(fetchTotalStaked),
    call(fetchKickoffTs),
    call(fetchVotingPower),
    call(fetchStakesList),
  ]);
}

function* triggerFetch() {
  yield* put(stakingActions.fetchStakingData());
}

function* runBalancesUpdater() {
  yield* triggerFetch();

  yield* takeLatest(
    [
      appActions.setChainId.type,
      appActions.setAccount.type,
      appActions.setBlockNumber.type,
    ],
    triggerFetch
  );
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
