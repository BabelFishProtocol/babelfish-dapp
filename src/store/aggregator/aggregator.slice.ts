import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { AggregatorState, FeesAndLimitsType } from './aggregator.state';

const initialState = { ...new AggregatorState() };

const aggregatorSlice = createSlice({
  name: Reducers.Aggregator,
  initialState,
  reducers: {
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
    setStartingToken: (
      state,
      { payload }: PayloadAction<AggregatorState['startingToken']>
    ) => {
      state.startingToken = payload;
    },
    setStartingChain: (
      state,
      { payload }: PayloadAction<AggregatorState['startingChain']>
    ) => {
      state.startingChain = payload;
    },
    setDestinationChain: (
      state,
      { payload }: PayloadAction<AggregatorState['destinationChain']>
    ) => {
      state.destinationChain = payload;
    },
    setWrongChainConnectedError: (
      state,
      { payload }: PayloadAction<AggregatorState['wrongChainConnectedError']>
    ) => {
      state.wrongChainConnectedError = payload;
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
    // setBridgeFee: (
    //   state,
    //   { payload }: PayloadAction<AggregatorState['bridgeFee']>
    // ) => {
    //   state.bridgeFee = payload;
    // },
    // setMinTransfer: (
    //   state,
    //   { payload }: PayloadAction<AggregatorState['minTransfer']>
    // ) => {
    //   state.minTransfer = payload;
    // },
    // setMaxTransfer: (
    //   state,
    //   { payload }: PayloadAction<AggregatorState['maxTransfer']>
    // ) => {
    //   state.maxTransfer = payload;
    // },
    // setDailyLimit: (
    //   state,
    //   { payload }: PayloadAction<AggregatorState['dailyLimit']>
    // ) => {
    //   state.dailyLimit = payload;
    // },
  },
});

const { actions: aggregatorActions, reducer: aggregatorReducer } =
  aggregatorSlice;
export { aggregatorActions, aggregatorReducer };

export type AppActions = ActionsType<typeof aggregatorActions>;
