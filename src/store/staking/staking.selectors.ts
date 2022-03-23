import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';
import { isTimeStampLocked } from '../../utils/helpers';

const stakingState = (state: RootState) => state[Reducers.Staking];

const fishTokenSelector = createSelector(
  stakingState,
  (state) => state.fishToken
);

export const fishTokenDataSelector = createSelector(
  fishTokenSelector,
  (fishToken) => fishToken.data
);
export const fishLoadingStateSelector = createSelector(
  fishTokenSelector,
  (fishToken) => fishToken.state
);

export const stakingConstantsSelector = createSelector(
  stakingState,
  (state) => state.constants.data
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
export const isSelectedStakeLockedSelector = createSelector(
  selectedStakeSelector,
  (stake) => (stake ? isTimeStampLocked(stake.unlockDate) : undefined)
);
