import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';
import { isTimeStampLocked } from '../../utils/helpers';
import { accountSelector, providerSelector } from '../app/app.selectors';
import { getVesting } from './vesting.utils';

const vestingState = (state: RootState) => state[Reducers.Vesting];

export const vestsListSelector = createSelector(
  vestingState,
  (state) => state.vestsList.data
);
export const vestsListStatusSelector = createSelector(
  vestingState,
  (state) => state.vestsList.state
);
export const selectedVestSelector = createSelector(
  [vestingState, vestsListSelector],
  (state, vestsList) => {
    const selectedVest = vestsList.find(
      (vest) => vest.unlockDate === state.selectedVest
    );
    return selectedVest;
  }
);

export const isSelectedVestLockedSelector = createSelector(
  selectedVestSelector,
  (vest) => (vest ? isTimeStampLocked(vest.unlockDate) : undefined)
);

export const selectedVestContractSelector = createSelector(
  [providerSelector, selectedVestSelector],
  (provider, selectedVest) => {
    if (!selectedVest || !provider) {
      return undefined;
    }
    const vesting = getVesting(selectedVest.address, provider);
    return vesting;
  }
);

export const stakesAndVestsAddressesSelector = createSelector(
  [accountSelector, vestsListSelector],
  (account, vests) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    const addresses = vests.map((vest) => vest.address);

    addresses.push(account.toLowerCase());
    return addresses;
  }
);
