import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Reducers } from '../../constants';

const appState = (state: RootState) => state[Reducers.App];

export const chainIdSelector = createSelector(
  appState,
  (state) => state.chainId
);
export const accountSelector = createSelector(
  appState,
  (state) => state.account
);
