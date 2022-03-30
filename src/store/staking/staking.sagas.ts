import { all, put, call, select, takeLatest } from 'typed-redux-saga';
import {
  historyStakesQuery,
  StakeHistoryQueryItem,
} from '../../queries/historyStakeListQuery';
import {
  accountSelector,
  fishTokenSelector,
  stakingContractSelector,
  subgraphClientSelector,
} from '../app/app.selectors';
import { createWatcherSaga } from '../utils';
import { vestsListSelector } from '../vesting/vesting.selectors';
import { stakesListSelector } from './staking.selectors';
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

export function* fetchHistoryStakeEvents() {
  const subgraphClient = yield* select(subgraphClientSelector);

  if (!subgraphClient) throw new Error('Wallet not connected');

  const { stakeEvents } = yield* call(historyStakesQuery, subgraphClient);

  return stakeEvents;
}

export function* filterContractStakedEvents(
  stakeEvents: StakeHistoryQueryItem[]
) {
  const account = yield* select(accountSelector);
  const vestsList = yield* select(vestsListSelector);

  if (!account || !vestsList) {
    throw new Error('Wallet not connected');
  }

  return stakeEvents.filter(
    ({ staker }) =>
      staker === account.toLowerCase() ||
      !!vestsList.find((vest) => vest.address === staker)
  );
}

export function* fetchHistoryStakingForContract() {
  try {
    const stakesList = yield* select(stakesListSelector);

    if (!stakesList) {
      throw new Error('Wallet not connected');
    }
    const stakeEvents = yield* call(fetchHistoryStakeEvents);
    const filteredStakeEvents = yield* call(
      filterContractStakedEvents,
      stakeEvents
    );

    const stakesHistory = filteredStakeEvents.map((stake) => ({
      asset: 'FISH',
      stakedAmount: stake.amount,
      unlockDate: stake.lockedUntil,
      totalStaked: stake.totalStaked,
      txHash: stake.transactionHash,
    }));

    yield* put(stakingActions.setHistoryStakesList(stakesHistory));
  } catch (e) {
    yield* put(stakingActions.fetchHistoryStakesListFailure());
  }
}

/** Fetch data needed for the stake page */
function* fetchBalances() {
  yield* all([
    call(fetchFishTokenData),
    call(fetchStakeConstants),
    call(fetchVotingPower),
    call(fetchStakesList),
    call(fetchHistoryStakingForContract),
  ]);
}

/** Update values that can potentially be changed after user actions */
function* updateBalances() {
  yield* all([
    call(fetchFishTokenData),
    call(fetchVotingPower),
    call(fetchStakesList),
    call(fetchHistoryStakingForContract),
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
    takeLatest(stakingActions.fetchStakingData.type, fetchBalances),
    takeLatest(stakingActions.updateStakingData.type, updateBalances),
    takeLatest(stakingActions.watchStakingData.type, watchStaking),
  ]);
}
