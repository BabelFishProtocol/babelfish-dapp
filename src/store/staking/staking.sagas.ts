import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { constants } from 'ethers';
import { all, put, call, select, takeLatest } from 'typed-redux-saga';
import { Staking } from '../../contracts/types';
import {
  accountSelector,
  fishTokenSelector,
  stakingContractSelector,
  vestingRegistrySelector,
  providerSelector,
} from '../app/app.selectors';
import { createWatcherSaga } from '../utils';
import { stakingActions } from './staking.slice';
import { StakeListItem, VestListAddress, VestListItem } from './staking.state';
import { getVesting } from './staking.utils';

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

function* setSingleVest(
  staking: Staking,
  vestAddress: VestListAddress,
  vestsList: VestListItem[],
  provider: Web3Provider
) {
  const vesting = yield* call(getVesting, vestAddress.address, provider);
  const { dates } = yield* call(staking.getStakes, vestAddress.address);
  const balanceOf = yield* call(staking.balanceOf, vestAddress.address);

  const delegate = yield* call(
    staking.delegates,
    vestAddress.address,
    dates[dates.length - 2].toNumber() // TODO: base on governance-dapp, check if we can use below endDate as we need to use date of the end of the stake
  );

  const startDate = yield* call(vesting.startDate);
  const endDate = yield* call(vesting.endDate);
  const cliff = yield* call(vesting.cliff);

  vestsList.push({
    asset: 'FISH',
    unlockDate: endDate.toNumber(),
    votingDelegation: delegate,
    lockedAmount: balanceOf.toString(),
    stakingPeriodStart: startDate.toNumber(),
    address: vestAddress.address,
    addressType: vestAddress.type,
    cliff: cliff.toNumber(),
  });
}

export function* fetchVestsList() {
  try {
    const account = yield* select(accountSelector);
    const vestingRegistry = yield* select(vestingRegistrySelector);
    const staking = yield* select(stakingContractSelector);
    const provider = yield* select(providerSelector);

    if (!vestingRegistry || !account || !staking || !provider) {
      throw new Error('Wallet not connected');
    }

    const vestsList: VestListItem[] = [];
    const addresses: VestListAddress[] = [];
    const vestAddress = yield* call(vestingRegistry.getVesting, account);
    if (vestAddress && constants.AddressZero !== vestAddress) {
      addresses.push({ address: vestAddress, type: 'genesis' });
    }
    const teamVestsAddresses = yield* call(
      vestingRegistry.getTeamVesting,
      account
    );
    if (teamVestsAddresses && constants.AddressZero !== teamVestsAddresses) {
      addresses.push({ address: teamVestsAddresses, type: 'team' });
    }

    yield* all(
      addresses.map((address) =>
        call(setSingleVest, staking, address, vestsList, provider)
      )
    );
    yield* put(stakingActions.setVestsList(vestsList));
  } catch (e) {
    yield* put(stakingActions.fetchVestsListFailure());
  }
}

/** Fetch data needed for the stake page */
function* fetchBalances() {
  yield* all([
    call(fetchFishTokenData),
    call(fetchStakeConstants),
    call(fetchVotingPower),
    call(fetchStakesList),
    call(fetchVestsList),
  ]);
}

/** Update values that can potentially be changed after user actions */
function* updateBalances() {
  yield* all([
    call(fetchFishTokenData),
    call(fetchVotingPower),
    call(fetchStakesList),
    call(fetchVestsList),
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
