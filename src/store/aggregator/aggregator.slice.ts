import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { AggregatorState, FeesAndLimitsType } from './aggregator.state';

const initialState = { ...new AggregatorState() };

const aggregatorSlice = createSlice({
  name: Reducers.Aggregator,
  initialState,
  reducers: {
    setStartingToken: (
      state,
      { payload }: PayloadAction<AggregatorState['startingToken']>
    ) => {
      state.startingToken = payload;
    },
    setDestinationChain: (
      state,
      { payload }: PayloadAction<AggregatorState['destinationChain']>
    ) => {
      state.destinationChain = payload;
    },
    setDestinationToken: (
      state,
      { payload }: PayloadAction<AggregatorState['destinationToken']>
    ) => {
      state.destinationToken = payload;
    },
    setFlowStateDeposit: (state) => {
      state.flowState = 'deposit';
    },
    setFlowStateWithdraw: (state) => {
      state.flowState = 'withdraw';
    },
    toggleFlowState: (state) => {
      state.flowState = state.flowState === 'deposit' ? 'withdraw' : 'deposit';
    },
    fetchAllowTokensAddressFailure: (state) => {
      state.allowTokensAddress.state = 'failure';
      state.allowTokensAddress.data = undefined;
    },
    setAllowTokensAddress: (state, { payload }: PayloadAction<string>) => {
      state.allowTokensAddress.state = 'success';
      state.allowTokensAddress.data = payload;
    },
    fetchFeesAndLimitsLoading: (state) => {
      state.feesAndLimits.state = 'loading';
    },
    fetchFeesAndLimitsFailure: (state) => {
      state.feesAndLimits.state = 'failure';
      state.feesAndLimits.data = {};
    },
    setFeesAndLimits: (
      state,
      { payload }: PayloadAction<FeesAndLimitsType>
    ) => {
      state.feesAndLimits.state = 'success';
      state.feesAndLimits.data = payload;
    },
    fetchStartingTokenBalanceFailure: (state) => {
      state.startingTokenBalance.state = 'failure';
      state.startingTokenBalance.data = undefined;
    },
    setStartingTokenBalance: (state, { payload }: PayloadAction<string>) => {
      state.startingTokenBalance.state = 'success';
      state.startingTokenBalance.data = payload;
    },
  },
});

const { actions: aggregatorActions, reducer: aggregatorReducer } =
  aggregatorSlice;
export { aggregatorActions, aggregatorReducer };

export type AggregatorActions = ActionsType<typeof aggregatorActions>;
