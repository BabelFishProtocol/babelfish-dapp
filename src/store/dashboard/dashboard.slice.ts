import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { DashboardBalances, DashboardState } from './dashboard.state';

const initialState = { ...new DashboardState() };

export const dashboardSlice = createSlice({
  name: Reducers.Dashboard,
  initialState,
  reducers: {
    watchData: (_) => {},
    stopWatchingData: (state) => {
      state.balances.state = 'idle';
    },
    fetchData: (state) => {
      state.balances.state = 'loading';
      state.balances.data = undefined;
    },
    updateData: (state) => {
      state.balances.state = 'loading';
    },

    fetchBalancesFailure: (state) => {
      state.balances.data = undefined;
      state.balances.state = 'failure';
    },

    setBalances: (state, { payload }: PayloadAction<DashboardBalances>) => {
      state.balances.data = payload;
      state.balances.state = 'success';
    },
  },
});

const { actions: dashboardActions, reducer: dashboardReducer } = dashboardSlice;
export { dashboardActions, dashboardReducer };

export type DashboardActions = ActionsType<typeof dashboardActions>;
