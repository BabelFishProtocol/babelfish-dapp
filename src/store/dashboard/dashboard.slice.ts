import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { DashboardBalances, DashboardState, Transactions } from './dashboard.state';

const initialState = { ...new DashboardState() };

export const dashboardSlice = createSlice({
  name: Reducers.Dashboard,
  initialState,
  reducers: {
    watchBalances: (state) => {
      state.balances.state = 'loading';
    },
    stopWatchingBalances: (state) => {
      state.balances.state = 'idle';
    },
    fetchBalances: (state) => {
      state.balances.state = 'loading';
      state.balances.data = undefined;
    },
    updateBalances: (state) => {
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

    watchTransactions: (state) => {
      state.transactionList.state = 'loading';
    },
    stopWatchingTransactions: (state) => {
      state.transactionList.state = 'idle';
    },
    fetchTransactions: (state) => {
      state.transactionList.data = [];
      state.transactionList.state = 'loading';
    },
    updateTransactions: (state) => {
      state.transactionList.state = 'loading';
    },
    fetchTransactionsFailure: (state) => {
      state.transactionList.data = [];
      state.transactionList.state = 'failure';
    },
    setTransactions: (state, { payload }: PayloadAction<Transactions[]>) => {
      state.transactionList.data = payload;
      state.transactionList.state = 'success';
    },
  },
});

const { actions: dashboardActions, reducer: dashboardReducer } = dashboardSlice;
export { dashboardActions, dashboardReducer };

export type DashboardActions = ActionsType<typeof dashboardActions>;
