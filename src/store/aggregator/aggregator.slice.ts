import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { PoolEnum } from '../../config/pools';
import {
  AggregatorState,
  FeesAndLimitsType,
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
    fetchStartingTokenBalanceFailure: (
      state,
      { payload }: PayloadAction<string>
    ) => {
      state.startingTokenBalance.state = 'failure';
      state.startingTokenBalance.data = undefined;
      state.fetchStartingTokenBalanceErrorReason = payload;
    },
    setStartingTokenBalance: (state, { payload }: PayloadAction<string>) => {
      state.startingTokenBalance.state = 'success';
      state.startingTokenBalance.data = payload;
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
      state.txDetails = payload;
    },
    resetAggregator: (state) => {
      state.allowTokensAddress.state = 'idle';
      state.allowTokensAddress.data = undefined;
      state.feesAndLimits.state = 'idle';
      state.feesAndLimits.data = {};
      state.fetchFeesAndLimitsErrorReason = undefined;
      state.startingTokenBalance.state = 'idle';
      state.startingTokenBalance.data = undefined;
      state.txDetails = undefined;
    },
  },
});

const { actions: aggregatorActions, reducer: aggregatorReducer } =
  aggregatorSlice;
export { aggregatorActions, aggregatorReducer };

export type AggregatorActions = ActionsType<typeof aggregatorActions>;
