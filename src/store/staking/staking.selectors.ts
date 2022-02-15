import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';

const stakingState = (state: RootState) => state[Reducers.Staking];

const stakingPageDataSelector = createSelector(
  stakingState,
  (state) => state.pageData.data
);

export const kichoffTsSelector = createSelector(
  stakingPageDataSelector,
  (state) => state.kickoffTs
);
export const stakingPageLoadingStatusSelector = createSelector(
  stakingState,
  (state) => state.pageData.state
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
