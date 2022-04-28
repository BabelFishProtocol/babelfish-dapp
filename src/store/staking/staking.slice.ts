import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { AddNewStakeFormValues } from '../../pages/Staking/AddNewStake/AddNewStake.types';
import { StakingHistoryListItem } from '../../pages/Staking/StakingHistory/StakingHistory.types';
import { IncreaseStakeFormValues } from '../../pages/Staking/StakesList/IncreaseStake/IncreaseStake.types';

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


    watchStakingData: (_) => {},
    stopWatchingStakingData: (state) => {
      state.fishToken.state = 'idle';
      state.combinedVotingPower.state = 'idle';
      state.stakesList.state = 'idle';
      state.stakesListHistory.state = 'idle';
    },
    fetchStakingData: (state) => {
      state.constants.state = 'loading';

      state.fishToken = initialState.fishToken;
      state.stakesList = initialState.stakesList;
      state.stakesListHistory = initialState.stakesListHistory;
      state.combinedVotingPower = initialState.combinedVotingPower;
    },
    updateStakingData: (state) => {
      state.fishToken.state = 'loading';
      state.combinedVotingPower.state = 'loading';
      state.stakesList.state = 'loading';
      state.stakesListHistory.state = 'loading';
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
      state.selectedStake = payload;
    },
    clearSelectedStake: (state) => {
      state.selectedStake = undefined;
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
