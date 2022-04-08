import {
  all,
  put,
  call,
  select,
  takeLatest,
  takeLeading,
  SagaGenerator,
  all,
  put,
  call,
  select,
  takeLatest,
} from 'typed-redux-saga';
import { CallEffect } from 'redux-saga/effects';
import { BigNumber, constants, ContractTransaction, utils } from 'ethers';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
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
import {
  StakingActions,
  stakingActions,
  stakingActions,
} from './staking.slice';
import {
  AddNewStakeCalls,
  CallState,
  StakeListItem,
  StakeListItem,
} from './staking.state';
import { vestingActions, vestingActions } from '../vesting/vesting.slice';
import { fishTokenDataSelector } from './staking.selectors';
import { ONE_DAY } from '../../constants';

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

function* callStake({ payload }: StakingActions['addNewStake']) {
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
      name: 'approve',
      effect: call(fishToken.approve, staking.address, parsedStakeAmount),
    });
  }

  steps.push({
    name: 'stake',
    effect: call(
      staking.stake,
      parsedStakeAmount,
      unlockDate + ONE_DAY, // adding 24 hours to date to make sure contract will not choose previous period,
      constants.AddressZero,
      constants.AddressZero
    ),
  });

  yield* contractCallSaga<AddNewStakeCalls>(
    steps,
    stakingActions.setAddStakeError,
    stakingActions.setAddStakeStateCallData
  );
}

type SagaContractCallStep<Operations extends string> = {
  name: Operations;
  effect: SagaGenerator<ContractTransaction, CallEffect<ContractTransaction>>;
};

function* stepCall<Operations extends string>(
  { effect, name }: SagaContractCallStep<Operations>,
  setStatusAction: ActionCreatorWithPayload<Partial<CallState<Operations>>>
) {
  yield* put(
    setStatusAction({
      currentOperation: name,
      status: 'loading',
    })
  );

  const tx = yield* effect;

  yield* put(setStatusAction({ tx }));

  const txReceipt = yield* call(tx.wait);

  yield* put(setStatusAction({ txReceipt }));
}

export function* contractCallSaga<Operations extends string>(
  steps: SagaContractCallStep<Operations>[],
  setErrorAction: ActionCreatorWithPayload<string>,
  setStatusAction: ActionCreatorWithPayload<Partial<CallState<Operations>>>
) {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const step of steps) {
      yield* stepCall(step, setStatusAction);
    }

    yield* put(setStatusAction({ status: 'success' }));
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : 'An unexpected error has occurred. Please try again';

    yield* put(setErrorAction(msg));
  }
}
