import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { PoolEnum } from '../../config/pools';
import {
  AggregatorState,
  FeesAndLimitsType,
  IncentiveType,
  TxDetails,
} from './aggregator.state';
import { createStepCallsActions } from '../utils/utils.reducers';
import { AggregatorFormValues } from '../../pages/Aggregator/Aggregator.fields';

const initialState = { ...new AggregatorState() };

const submitStepCallActions = createStepCallsActions(
  initialState,
  'submitCall'
);

const aggregatorSlice = createSlice({
  name: Reducers.Convert,
  initialState,
  reducers: {
    setStartingChain: (
      state,
      { payload }: PayloadAction<AggregatorState['startingChain']>
    ) => {
      console.log('setStartingChain');
      state.startingChain = payload;
    },
    setStartingToken: (
      state,
      { payload }: PayloadAction<AggregatorState['startingToken']>
    ) => {
      console.log('setStartingToken');
      state.startingToken = payload;
    },
    setDestinationChain: (
      state,
      { payload }: PayloadAction<AggregatorState['destinationChain']>
    ) => {
      console.log('setDestinationChain');
      state.destinationChain = payload;
    },
    setSendAmount: (
      state,
      { payload }: PayloadAction<AggregatorState['sendAmount']>
    ) => {
      console.log('setSendAmount');
      state.sendAmount = payload;
    },
    setDestinationToken: (
      state,
      { payload }: PayloadAction<AggregatorState['destinationToken']>
    ) => {
      console.log('setDestinationToken');
      state.destinationToken = payload;
    },
    fetchAllowTokensAddressFailure: (state) => {
      console.log('fetchAllowTokensAddressFailure');
      state.allowTokensAddress.state = 'failure';
      state.allowTokensAddress.data = undefined;
    },
    setAllowTokensAddress: (state, { payload }: PayloadAction<string>) => {
      console.log('setAllowTokensAddress');
      state.allowTokensAddress.state = 'success';
      state.allowTokensAddress.data = payload;
    },
    fetchFeesAndLimitsLoading: (state) => {
      console.log('fetchFeesAndLimitsLoading');
      state.feesAndLimits.state = 'loading';
      state.feesAndLimits.data = {};
    },
    fetchFeesAndLimitsFailure: (state, { payload }: PayloadAction<string>) => {
      console.log('fetchFeesAndLimitsFailure');
      state.feesAndLimits.state = 'failure';
      state.feesAndLimits.data = {};
      state.fetchFeesAndLimitsErrorReason = payload;
    },
    setFeesAndLimits: (
      state,
      { payload }: PayloadAction<FeesAndLimitsType>
    ) => {
      console.log('setFeesAndLimits');
      state.feesAndLimits.state = 'success';
      state.feesAndLimits.data = payload;
    },
    fetchStartingTokenBalanceLoading: (state) => {
      console.log('fetchStartingTokenBalanceLoading');
      state.startingTokenBalance.state = 'loading';
    },
    fetchStartingTokenBalanceFailure: (
      state,
      { payload }: PayloadAction<string>
    ) => {
      console.log('fetchStartingTokenBalanceFailure');
      state.startingTokenBalance.state = 'failure';
      state.startingTokenBalance.data = undefined;
      state.fetchStartingTokenBalanceErrorReason = payload;
    },
    setStartingTokenBalance: (state, { payload }: PayloadAction<string>) => {
      console.log('setStartingTokenBalance');
      state.startingTokenBalance.state = 'success';
      state.startingTokenBalance.data = payload;
    },
    fetchDestinationTokenAggregatorBalanceLoading: (state) => {
      console.log('fetchDestinationTokenAggregatorBalanceLoading');
      state.destinationTokenAggregatorBalance.state = 'loading';
    },
    fetchDestinationTokenAggregatorBalanceFailure: (
      state,
      { payload }: PayloadAction<string>
    ) => {
      console.log('fetchDestinationTokenAggregatorBalanceFailure');
      state.destinationTokenAggregatorBalance.state = 'failure';
      state.destinationTokenAggregatorBalance.data = undefined;
      state.fetchDestinationTokenAggregatorBalanceErrorReason = payload;
    },
    setDestinationTokenAggregatorBalance: (
      state,
      { payload }: PayloadAction<string>
    ) => {
      console.log('setDestinationTokenAggregatorBalance');
      state.destinationTokenAggregatorBalance.state = 'success';
      state.destinationTokenAggregatorBalance.data = payload;
    },
    setIsStartingTokenPaused: (state, { payload }: PayloadAction<string[]>) => {
      console.log('setIsStartingTokenPaused');
      state.pausedTokens = payload;
    },
    setIncentivesLoading: (state) => {
      console.log('setIncentivesLoading');
      state.incentives.state = 'loading';
      state.incentives.data = {};
    },
    setIncentivesFailure: (state) => {
      console.log('setIncentivesFailure');
      state.incentives.state = 'failure';
      state.incentives.data = {};
    },
    setIncentives: (
      state,
      { payload }: PayloadAction<{ type: IncentiveType; amount: string }>
    ) => {
      console.log('setIncentives');
      state.incentives.state = 'success';
      state.incentives.data = payload;
    },
    setReceiveAmount: (state, { payload }: PayloadAction<string>) => {
      console.log('setReceiveAmount');
      state.receiveAmount = payload;
    },
    togglePool: (state) => {
      state.pool =
        state.pool === PoolEnum.testnet ? PoolEnum.mainnet : PoolEnum.testnet;
    },
    submit: submitStepCallActions.trigger<AggregatorFormValues>(),
    resetSubmitCall: submitStepCallActions.reset,
    setSubmitStatus: submitStepCallActions.setStatus,
    setSubmitSteps: submitStepCallActions.setSteps,
    setSubmitStepData: submitStepCallActions.updateStep,
    setSubmitError: submitStepCallActions.setStepError,
    setTransactionDetails: (state, { payload }: PayloadAction<TxDetails>) => {
      console.log('setTransactionDetails');
      state.txDetails = payload;
    },
    resetAggregator: (state) => {
      console.log('resetAggregator');
      state.allowTokensAddress.state = 'idle';
      state.allowTokensAddress.data = undefined;
      state.feesAndLimits.state = 'idle';
      state.feesAndLimits.data = {};
      state.fetchFeesAndLimitsErrorReason = undefined;
      state.startingTokenBalance.state = 'idle';
      state.startingTokenBalance.data = undefined;
      state.txDetails = undefined;
      state.incentives.state = 'idle';
      state.incentives.data = {};
      state.receiveAmount = undefined;
      state.slippageSlider = 20;
    },
  },
});

const { actions: aggregatorActions, reducer: aggregatorReducer } =
  aggregatorSlice;
export { aggregatorActions, aggregatorReducer };

export type AggregatorActions = ActionsType<typeof aggregatorActions>;
