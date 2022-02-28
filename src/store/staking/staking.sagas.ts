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
import {
  accountSelector,
  fishTokenSelector,
  stakingContractSelector,
} from '../app/app.selectors';
import { appActions } from '../app/app.slice';
import { stakingActions } from './staking.slice';
import { StakeListItem } from './staking.state';

export function* fetchFishTokenData() {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);
    const fishToken = yield* select(fishTokenSelector);

    if (!staking || !account || !fishToken) {
      throw new Error('Wallet not connected');
    }

    const totalStaked = yield* call(staking.balanceOf, account);
    const totalBalance = yield* call(fishToken.balanceOf, account);
    const allowanceForStaking = yield* call(
      fishToken.allowance,
      account,
      staking.address
    );

    yield* put(
      stakingActions.setFishTokenData({
        totalStaked: totalStaked.toString(),
        fishBalance: totalBalance.toString(),
        allowanceForStaking: allowanceForStaking.toString(),
      })
    );
  } catch (e) {
    yield* put(stakingActions.fetchFishTokenDataFailure());
  }
}

export function* fetchStakeConstants() {
  try {
    const staking = yield* select(stakingContractSelector);

    if (!staking) {
      throw new Error('Wallet not connected');
    }

    const kickoffTS = yield* call(staking.kickoffTS);
    const WEIGHT_FACTOR = yield* call(staking.WEIGHT_FACTOR);

    yield* put(
      stakingActions.setConstants({
        kickoffTs: kickoffTS.toNumber(),
        WEIGHT_FACTOR: WEIGHT_FACTOR.toString(),
      })
    );
  } catch (e) {
    yield* put(stakingActions.fetchConstantsFailure());
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

/** Fetch data needed for the stake page */
function* fetchBalances() {
  yield* all([
    call(fetchFishTokenData),
    call(fetchStakeConstants),
    call(fetchVotingPower),
    call(fetchStakesList),
  ]);
}

/** Update values that can potentialy be changed after user actions */
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

function* runBalancesUpdater() {
  yield* put(stakingActions.fetchStakingData());

  yield* takeLatest(
    [
      appActions.setChainId.type,
      appActions.setAccount.type,
      appActions.setBlockNumber.type,
    ],
    triggerUpdate
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
    takeLatest(stakingActions.updateStakingData.type, updateBalances),
    takeLatest(stakingActions.watchStakingData.type, watchStakingData),
  ]);
}
