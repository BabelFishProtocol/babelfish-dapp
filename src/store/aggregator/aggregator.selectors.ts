import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';

const aggregatorState = (state: RootState) => state[Reducers.Aggregator];

export const bridgeFeeSelector = createSelector(
  aggregatorState,
  (state) => state.bridgeFee
);

export const minTransferSelector = createSelector(
  aggregatorState,
  (state) => state.minTransfer
);
export const maxTransferSelector = createSelector(
  aggregatorState,
  (state) => state.maxTransfer
);
export const dailyLimitSelector = createSelector(
  aggregatorState,
  (state) => state.dailyLimit
);
