import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { AggregatorState } from './aggregator.state';

const initialState = { ...new AggregatorState() };

const aggregatorSlice = createSlice({
  name: Reducers.Aggregator,
  initialState,
  reducers: {
    fetchAllowTokensAddressFailure: (state) => {
      state.allowTokensAddress.state = 'failure';
      state.allowTokensAddress.data = undefined;
    },
    setAllowTokensAddress: (state, { payload }: PayloadAction<string>) => {
      state.allowTokensAddress.state = 'success';
      state.allowTokensAddress.data = payload;
    },
    setTokenFrom: (
      state,
      { payload }: PayloadAction<AggregatorState['tokenFrom']>
    ) => {
      state.tokenFrom = payload;
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
