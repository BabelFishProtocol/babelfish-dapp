import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';
import { accountSelector, providerSelector } from '../app/app.selectors';
import { getVesting } from './vesting.utils';

export const vestingState = (state: RootState) => state[Reducers.Vesting];

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

export const selectedVestContractSelector = createSelector(
  [providerSelector, selectedVestSelector],
  (provider, selectedVest) => {
    if (!provider || !selectedVest) {
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
      return undefined;
    }

    const addresses = vests.map((vest) => vest.address);

    addresses.push(account.toLowerCase());
    return addresses;
  }
);
