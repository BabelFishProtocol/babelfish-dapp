import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';
import { isTimeStampLocked } from '../../utils/helpers';
import { selectCurrentCallStepData } from '../utils/utils.selectors';

const stakingState = (state: RootState) => state[Reducers.Staking];

export const fishTokenSelector = createSelector(
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

export const stakesHistoryListSelector = createSelector(
  stakingState,
  (state) => state.stakesListHistory.data
);

export const stakesHistoryListStatusSelector = createSelector(
  stakingState,
  (state) => state.stakesListHistory.state
);

export const stakesDatesSelector = createSelector(
  stakesListSelector,
  (stakes) => stakes.map((stake) => stake.unlockDate)
);

export const selectedStakeSelector = createSelector(
  [stakingState, stakesListSelector],
  (state) => state.selectedStake
);
export const isSelectedStakeLockedSelector = createSelector(
  selectedStakeSelector,
  (stake) => (stake ? isTimeStampLocked(stake.unlockDate) : undefined)
);

export const addStakeSubmitStatusSelector = createSelector(
  stakingState,
  (state) => selectCurrentCallStepData(state.addNewStakeCall)
);

export const increaseStakeStatusSelector = createSelector(
  stakingState,
  (state) => selectCurrentCallStepData(state.increaseCall)
);

export const extendStakeStatusSelector = createSelector(stakingState, (state) =>
  selectCurrentCallStepData(state.extendCall)
);

export const delegateStatusSelector = createSelector(stakingState, (state) =>
  selectCurrentCallStepData(state.delegateCall)
);

export const withdrawalStatusSelector = createSelector(stakingState, (state) =>
  selectCurrentCallStepData(state.withdrawCall)
);
