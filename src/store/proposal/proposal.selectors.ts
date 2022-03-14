import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';

export const proposalState = (state: RootState) => state[Reducers.Proposal];

export const thresholdSelector = createSelector(
  proposalState,
  (prop) => prop.threshold
);
