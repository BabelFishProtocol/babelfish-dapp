import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { AddNewStakeFormValues } from '../../pages/Staking/AddNewStake/AddNewStake.types';
import { ExtendStakeValues } from '../../pages/Staking/StakesList/ExtendStake/ExtendStake.fields';
import { StakingHistoryListItem } from '../../pages/Staking/StakingHistory/StakingHistory.types';
import { IncreaseStakeFormValues } from '../../pages/Staking/StakesList/IncreaseStake/IncreaseStake.types';
import { DelegateStakeValues } from '../../pages/Staking/StakesList/DelegateStake/DelegateStake.fields';
import { WithdrawStakeFormValues } from '../../pages/Staking/StakesList/WithdrawStake/WithdrawStake.fields';

import { ActionsType } from '../types';
import { createStepCallsActions } from '../utils/utils.reducers';
import {
  StakingState,
  FishTokenInfo,
  StakeListItem,
  StakeConstants,
} from './staking.state';

const initialState = { ...new StakingState() };

const addStakeStepCallActions = createStepCallsActions(
  initialState,
  'addNewStakeCall'
);
const increaseStepCallActions = createStepCallsActions(
  initialState,
  'increaseCall'
);
const extendStakeStepCallActions = createStepCallsActions(
  initialState,
  'extendCall'
);
const delegateStakeStepCallActions = createStepCallsActions(
  initialState,
  'delegateCall'
);
const withdrawStepCallActions = createStepCallsActions(
  initialState,
  'withdrawCall'
);

export const stakingSlice = createSlice({
  name: Reducers.Staking,
  initialState,
  reducers: {
    // ----- add new stake call -----

    addNewStake: addStakeStepCallActions.trigger<AddNewStakeFormValues>(),
    resetAddNewStake: addStakeStepCallActions.reset,
    setAddStakeStatus: addStakeStepCallActions.setStatus,
    setAddStakeSteps: addStakeStepCallActions.setSteps,
    setAddStakeStepData: addStakeStepCallActions.updateStep,
    setAddStakeError: addStakeStepCallActions.setStepError,

    // ----- increase stake call -----

    increaseStake: increaseStepCallActions.trigger<IncreaseStakeFormValues>(),
    resetIncrease: increaseStepCallActions.reset,
    setIncreaseStatus: increaseStepCallActions.setStatus,
    setIncreaseSteps: increaseStepCallActions.setSteps,
    setIncreaseStepData: increaseStepCallActions.updateStep,
    setIncreaseError: increaseStepCallActions.setStepError,

    // ----- extend stake call -----

    extendStake: extendStakeStepCallActions.trigger<ExtendStakeValues>(),
    resetExtend: extendStakeStepCallActions.reset,
    setExtendStatus: extendStakeStepCallActions.setStatus,
    setExtendStepData: extendStakeStepCallActions.updateStep,
    setExtendError: extendStakeStepCallActions.setStepError,

    // ----- delegate stake call -----

    delegateStake: delegateStakeStepCallActions.trigger<DelegateStakeValues>(),
    resetDelegate: delegateStakeStepCallActions.reset,
    setDelegateStatus: delegateStakeStepCallActions.setStatus,
    setDelegateStepData: delegateStakeStepCallActions.updateStep,
    setDelegateError: delegateStakeStepCallActions.setStepError,

    // ----- withdraw stake call -----

    withdrawStake: withdrawStepCallActions.trigger<WithdrawStakeFormValues>(),
    resetWithdrawal: withdrawStepCallActions.reset,
    setWithdrawalStatus: withdrawStepCallActions.setStatus,
    setWithdrawalStepData: withdrawStepCallActions.updateStep,
    setWithdrawalError: withdrawStepCallActions.setStepError,

    watchStakingData: (state) => {
      state.fishToken.state = 'loading';
      state.combinedVotingPower.state = 'loading';
      state.stakesList.state = 'loading';
      state.stakesListHistory.state = 'loading';
      state.stakesListHistory.data = [];
    },
    stopWatchingStakingData: (state) => {
      state.fishToken.state = 'idle';
      state.combinedVotingPower.state = 'idle';
      state.stakesList.state = 'idle';
      state.stakesListHistory.state = 'idle';
    },
    fetchStakingData: (state) => {
      state.constants.state = 'loading';
      state.fishToken.state = 'loading';
      state.combinedVotingPower.state = 'loading';
      state.stakesList.state = 'loading';
      // state.stakesListHistory.state = 'loading';
      state.fishToken.data = {};
      state.combinedVotingPower.data = undefined;
      state.stakesList.data = [];
      // state.stakesListHistory.data = [];
    },
    updateStakingData: (state) => {
      state.fishToken.state = 'loading';
      state.combinedVotingPower.state = 'loading';
      state.stakesList.state = 'loading';
      // state.stakesListHistory.state = 'loading';
    },

    fetchFishTokenDataFailure: (state) => {
      state.fishToken.state = 'failure';
      state.fishToken.data = {};
    },
    setFishTokenData: (state, { payload }: PayloadAction<FishTokenInfo>) => {
      state.fishToken.state = 'success';
      state.fishToken.data = payload;
    },

    fetchConstantsFailure: (state) => {
      state.constants.state = 'failure';
      state.constants.data = {};
    },
    setConstants: (state, { payload }: PayloadAction<StakeConstants>) => {
      state.constants.state = 'success';
      state.constants.data = payload;
    },

    fetchVotingPowerFailure: (state) => {
      state.combinedVotingPower.state = 'failure';
      state.combinedVotingPower.data = undefined;
    },
    setVotingPower: (state, { payload }: PayloadAction<string>) => {
      state.combinedVotingPower.state = 'success';
      state.combinedVotingPower.data = payload;
    },

    fetchStakesListFailure: (state) => {
      state.stakesList.data = [];
      state.stakesList.state = 'failure';
    },
    setStakesList: (state, { payload }: PayloadAction<StakeListItem[]>) => {
      state.stakesList.data = payload;
      state.stakesList.state = 'success';
    },

    selectStake: (state, { payload }: PayloadAction<number>) => {
      const selectedStake = state.stakesList.data.find(
        (stake) => stake.unlockDate === payload
      );

      state.selectedStake = selectedStake;
    },
    clearSelectedStake: (state) => {
      state.selectedStake = undefined;
    },

    fetchHistoryStakesList: (state) => {
      state.stakesListHistory.state = 'loading';
    },
    fetchHistoryStakesListFailure: (state) => {
      state.stakesListHistory.data = [];
      state.stakesListHistory.state = 'failure';
    },
    setHistoryStakesList: (
      state,
      { payload }: PayloadAction<StakingHistoryListItem[]>
    ) => {
      state.stakesListHistory.data = payload;
      state.stakesListHistory.state = 'success';
    },
  },
});

const { actions: stakingActions, reducer: stakingReducer } = stakingSlice;
export { stakingActions, stakingReducer };

export type StakingActions = ActionsType<typeof stakingActions>;
