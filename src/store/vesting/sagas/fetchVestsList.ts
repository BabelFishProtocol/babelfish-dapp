import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { constants } from 'ethers';
import { all, put, call, select } from 'typed-redux-saga';
import { Staking } from '../../../contracts/types';
import {
  accountSelector,
  stakingContractSelector,
  providerSelector,
} from '../../app/app.selectors';
import { createWatcherSaga } from '../../utils/utils.sagas';
import { vestingActions } from '../vesting.slice';
import { VestListAddress, VestListItem } from '../vesting.state';
import { getUserVestings, getVesting } from '../vesting.utils';

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
    const staking = yield* select(stakingContractSelector);
    const provider = yield* select(providerSelector);

    if (!account || !staking || !provider) {
      throw new Error('Wallet not connected');
    }

    const vestsList: VestListItem[] = [];
    const addresses: VestListAddress[] = [];

    const { vestAddress, teamVestAddress } = yield* call(getUserVestings);

    if (vestAddress && constants.AddressZero !== vestAddress) {
      addresses.push({ address: vestAddress, type: 'genesis' });
    }
    if (teamVestAddress && constants.AddressZero !== teamVestAddress) {
      addresses.push({ address: teamVestAddress, type: 'team' });
    }

    yield* all(
      addresses.map((address) =>
        call(setSingleVest, staking, address, vestsList, provider)
      )
    );
    yield* put(vestingActions.setVestsList(vestsList));
  } catch (e) {
    yield* put(vestingActions.fetchVestsListFailure());
  }
}

function* triggerUpdate() {
  yield* put(vestingActions.updateVestingData());
}

function* triggerFetch() {
  yield* put(vestingActions.fetchVestingData());
}

export const watchVesting = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: vestingActions.stopWatchingVestingData.type,
});
