import { BigNumber, constants } from 'ethers';
import { all, put, call, select, takeLatest } from 'typed-redux-saga';

import { Staking } from '../../contracts/types';
import {
  multiCall,
  createWatcherSaga,
  convertForMulticall,
} from '../utils/utils.sagas';

import {
  accountSelector,
  stakingContractSelector,
  fishTokenSelector,
  multicallProviderSelector,
} from '../app/app.selectors';
import { getUserVestings } from '../vesting/vesting.utils';
import { dashboardActions } from './dashboard.slice';
import { xusdTokenSelector } from './dashboard.selectors';

export function* getVestBalance(staking: Staking, vestingAddress: string) {
  if (!vestingAddress || vestingAddress === constants.AddressZero) {
    return BigNumber.from(0);
  }

  const vestingBalance = yield* call(staking.balanceOf, vestingAddress);
  return vestingBalance;
}

export function* fetchDashboardBalances() {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);
    const fishToken = yield* select(fishTokenSelector);
    const xusdToken = yield* select(xusdTokenSelector);
    const multicallProvider = yield* select(multicallProviderSelector);

    if (
      !staking ||
      !account ||
      !fishToken ||
      !xusdToken ||
      !multicallProvider
    ) {
      throw new Error('Wallet not connected');
    }

    const { vestAddress, teamVestAddress } = yield* call(getUserVestings);

    const [vestBalance, teamVestBalance] = yield* all([
      call(getVestBalance, staking, vestAddress),
      call(getVestBalance, staking, teamVestAddress),
    ]);

    const fishStakedCall = convertForMulticall(
      staking,
      'balanceOf',
      'balanceOf(address)',
      account
    );

    const fishBalanceCall = convertForMulticall(
      fishToken,
      'balanceOf',
      'balanceOf(address)',
      account
    );

    const xusdBalanceCall = convertForMulticall(
      xusdToken,
      'balanceOf',
      'balanceOf(address)',
      account
    );

    const [fishStaked, fishBalance, xusdBalance] = yield* multiCall(
      multicallProvider,
      fishStakedCall,
      fishBalanceCall,
      xusdBalanceCall
    );

    /** Combined amount of liquid, staked and vested fish tokens */
    const fishTokensTotal = fishBalance
      .add(fishStaked)
      .add(vestBalance)
      .add(teamVestBalance);

    yield* put(
      dashboardActions.setBalances({
        fishBalance: fishBalance.toString(),
        totalFish: fishTokensTotal.toString(),
        xusdBalance: xusdBalance.toString(),
      })
    );
  } catch (e) {
    yield* put(dashboardActions.fetchBalancesFailure());
  }
}

function* triggerUpdate() {
  yield* put(dashboardActions.updateData());
}

function* triggerFetch() {
  yield* put(dashboardActions.fetchData());
}

const watchVesting = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: dashboardActions.stopWatchingData.type,
});

export function* dashboardSaga() {
  yield* all([
    takeLatest(dashboardActions.fetchData.type, fetchDashboardBalances),
    takeLatest(dashboardActions.updateData.type, fetchDashboardBalances),
    takeLatest(dashboardActions.watchData.type, watchVesting),
  ]);
}
