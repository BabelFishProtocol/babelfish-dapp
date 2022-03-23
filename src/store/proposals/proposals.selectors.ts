import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';

const proposalsState = (state: RootState) => state[Reducers.Proposals];

export const proposalsListSelector = createSelector(
  proposalsState,
  (state) => state.proposalsList
);

export const addProposalStateSelector = createSelector(
  proposalsState,
  (state) => state.addProposalState
);

export const addProposalErrorSelector = createSelector(
  proposalsState,
  (state) => state.addProposalErrorReason
);
