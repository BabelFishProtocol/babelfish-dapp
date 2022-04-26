import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { PoolEnum } from '../../config/pools';
import { AggregatorState, FeesAndLimitsType } from './aggregator.state';
import { AggregatorFormValues } from '../../pages/Aggregator/Aggregator.fields';

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
      state.feesAndLimits.data = {};
    },
    fetchFeesAndLimitsFailure: (state, { payload }: PayloadAction<string>) => {
      state.feesAndLimits.state = 'failure';
      state.feesAndLimits.data = {};
      state.fetchFeesAndLimitsErrorReason = payload;
    },
    setFeesAndLimits: (
      state,
      { payload }: PayloadAction<FeesAndLimitsType>
    ) => {
      state.feesAndLimits.state = 'success';
      state.feesAndLimits.data = payload;
    },
    fetchStartingTokenBalanceLoading: (state) => {
      state.startingTokenBalance.state = 'loading';
    },
    fetchStartingTokenBalanceFailure: (state) => {
      state.startingTokenBalance.state = 'failure';
      state.startingTokenBalance.data = undefined;
    },
    setStartingTokenBalance: (state, { payload }: PayloadAction<string>) => {
      state.startingTokenBalance.state = 'success';
      state.startingTokenBalance.data = payload;
    },
    togglePool: (state) => {
      state.pool =
        state.pool === PoolEnum.testnet ? PoolEnum.mainnet : PoolEnum.testnet;
    },
    watchTransferTokens: () => {},
    checkTransferTokens: () => {
      // TODO : Implement checking if can transfer
    },
    stopWatchingTransferTokens: (state) => {
      state.transferTokensState = 'idle';
      state.transferTokensErrorReason = undefined;
    },
    startTokenTransfer: (state, _: PayloadAction<AggregatorFormValues>) => {
      state.transferTokensState = 'loading';
    },
    transferTokensFailure: (state, { payload }: PayloadAction<string>) => {
      state.transferTokensState = 'failure';
      state.transferTokensErrorReason = payload;
    },
    transferTokensSuccess: (state) => {
      state.transferTokensState = 'success';
    },
    resetAggregator: (state) => {
      state.allowTokensAddress.state = 'idle';
      state.allowTokensAddress.data = undefined;
      state.feesAndLimits.state = 'idle';
      state.feesAndLimits.data = {};
      state.fetchFeesAndLimitsErrorReason = undefined;
      state.startingTokenBalance.state = 'idle';
      state.startingTokenBalance.data = undefined;
    },
  },
});

const { actions: aggregatorActions, reducer: aggregatorReducer } =
  aggregatorSlice;
export { aggregatorActions, aggregatorReducer };

export type AggregatorActions = ActionsType<typeof aggregatorActions>;
