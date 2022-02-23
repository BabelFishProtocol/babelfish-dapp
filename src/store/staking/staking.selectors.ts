import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';

const stakingState = (state: RootState) => state[Reducers.Staking];

export const totalStakedSelector = createSelector(
  stakingState,
  (state) => state.totalStaked
);

export const kickoffTsSelector = createSelector(
  stakingState,
  (state) => state.kickoffTs
);

export const combinedVotingPowerSelector = createSelector(
  stakingState,
  (state) => state.combinedVotingPower
);

export const stakesListSelector = createSelector(
  stakingState,
  (state) => state.stakesList.data
);
export const stakesListStatusSelector = createSelector(
  stakingState,
  (state) => state.stakesList.state
);
export const stakesDatesSelector = createSelector(
  stakesListSelector,
  (stakes) => stakes.map((stake) => stake.unlockDate)
);

export const selectedStakeSelector = createSelector(
  [stakingState, stakesListSelector],
  (state, stakesList) => {
    const selectedStake = stakesList.find(
      (stake) => stake.unlockDate === state.selectedStake
    );
    return selectedStake;
  }
);

export const vestsListSelector = createSelector(
  stakingState,
  (state) => state.vestsList.data
);
export const vestsListStatusSelector = createSelector(
  stakingState,
  (state) => state.vestsList.state
);
export const selectedVestSelector = createSelector(
  [stakingState, vestsListSelector],
  (state, vestsList) => {
    const selectedStake = vestsList.find(
      (vest) => vest.unlockDate === state.selectedVest
    );
    return selectedStake;
  }
);
