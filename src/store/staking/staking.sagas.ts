import { all, put, call, takeLatest, select } from 'typed-redux-saga';
import { BigNumber, constants, utils } from 'ethers';

import { ONE_DAY } from '../../constants';
import { SagaContractCallStep } from '../types';
import { createWatcherSaga, contractStepCallsSaga } from '../utils/utils.sagas';

import { StakingActions, stakingActions } from './staking.slice';
import { vestingActions } from '../vesting/vesting.slice';
import { fetchHistoryStaking } from './sagas/fetchHistoryStaking';
import { fetchStakesList } from './sagas/fetchStakesList';
import { fetchVotingPower } from './sagas/fetchVotingPower';
import { fetchStakeConstants } from './sagas/fetchStakeConstants';
import { fetchFishTokenData } from './sagas/fetchFishTokenData';
import {
  fishTokenSelector,
  stakingContractSelector,
} from '../app/app.selectors';
import { fishTokenDataSelector } from './staking.selectors';
import { AddNewStakeCalls } from './staking.state';

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
    takeLatest(stakingActions.fetchStakingData.type, fetchBalances),
    takeLatest(stakingActions.updateStakingData.type, updateBalances),
    takeLatest(stakingActions.watchStakingData.type, watchStaking),
    takeLatest(
      [stakingActions.setStakesList, vestingActions.setVestsList],
      fetchHistoryStaking
    ),
  ]);
}

export function* addNewStake({ payload }: StakingActions['addNewStake']) {
  const { unlockDate, stakeAmount } = payload;
  const parsedStakeAmount = utils.parseEther(stakeAmount);

  const staking = yield* select(stakingContractSelector);
  const fishToken = yield* select(fishTokenSelector);
  const { allowanceForStaking } = yield* select(fishTokenDataSelector);

  if (!staking || !fishToken) {
    yield* put(stakingActions.setAddStakeError('Wallet not connected'));
    return;
  }

  const steps: SagaContractCallStep<AddNewStakeCalls>[] = [];

  if (BigNumber.from(allowanceForStaking).lt(parsedStakeAmount)) {
    steps.push({
      name: 'approving',
      effect: call(fishToken.approve, staking.address, parsedStakeAmount),
    });
  }

  steps.push({
    name: 'staking',
    effect: call(
      staking.stake,
      parsedStakeAmount,
      unlockDate + ONE_DAY, // adding 24 hours to date to make sure contract will not choose previous period,
      constants.AddressZero,
      constants.AddressZero
    ),
  });

  yield* contractStepCallsSaga<AddNewStakeCalls>({
    steps,
    setErrorAction: stakingActions.setAddStakeError,
    setStatusAction: stakingActions.setAddStakeStatus,
    setStepDataAction: stakingActions.setAddStakeStateStepData,
  });
}
