import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';

export const proposalState = (state: RootState) => state[Reducers.Proposal];

export const proposalStateSelector = createSelector(
  proposalState,
  (state) => state.constants.state
);

export const proposalErrorSelector = createSelector(
  proposalState,
  (state) => state.errorReason
);
