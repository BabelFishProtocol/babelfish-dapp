import { all, put, call, select, takeLatest } from 'typed-redux-saga';
import { historyStakesQuery } from '../../queries/historyStakeListQuery';
import {
  accountSelector,
  fishTokenSelector,
  multicallProviderSelector,
  stakingContractSelector,
  subgraphClientSelector,
} from '../app/app.selectors';
import { stakesAndVestsAddressesSelector } from '../vesting/vesting.selectors';
import { convertForMulticall, createWatcherSaga, multiCall } from '../utils';
import { stakingActions } from './staking.slice';
import { StakeListItem } from './staking.state';
import { vestingActions } from '../vesting/vesting.slice';

export function* fetchFishTokenData() {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);
    const fishToken = yield* select(fishTokenSelector);
    const multicallProvider = yield* select(multicallProviderSelector);

    if (!staking || !account || !fishToken || !multicallProvider) {
      throw new Error('Wallet not connected');
    }

    const totalStakedCall = convertForMulticall(
      staking,
      'balanceOf',
      'balanceOf(address)',
      account
    );

    const totalBalanceCall = convertForMulticall(
      fishToken,
      'balanceOf',
      'balanceOf(address)',
      account
    );

    const allowanceForStakingCall = convertForMulticall(
      fishToken,
      'allowance',
      'allowance(address,address)',
      account,
      staking.address
    );

    const [totalStaked, totalBalance, allowanceForStaking] = yield* multiCall(
      multicallProvider,
      totalStakedCall,
      totalBalanceCall,
      allowanceForStakingCall
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

export function* fetchHistoryStaking() {
  try {
    const subgraphClient = yield* select(subgraphClientSelector);
    const contractAddresses = yield* select(stakesAndVestsAddressesSelector);

    if (!subgraphClient || !contractAddresses?.length)
      throw new Error('Wallet not connected');

    const { stakeEvents } = yield* call(historyStakesQuery, subgraphClient, {
      contractAddresses,
    });

    const stakesHistory = stakeEvents.map((stake) => ({
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
    takeLatest(stakingActions.fetchStakingData.type, fetchBalances),
    takeLatest(stakingActions.updateStakingData.type, updateBalances),
    takeLatest(stakingActions.watchStakingData.type, watchStaking),
    takeLatest(
      [stakingActions.setStakesList, vestingActions.setVestsList],
      fetchHistoryStaking
    ),
  ]);
}
