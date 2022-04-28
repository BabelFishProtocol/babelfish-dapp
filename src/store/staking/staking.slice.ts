import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { AddNewStakeFormValues } from '../../pages/Staking/AddNewStake/AddNewStake.types';
import { IncreaseStakeFormValues } from '../../pages/Staking/StakesList/IncreaseStake/IncreaseStake.types';
import { StakingHistoryListItem } from '../../pages/Staking/StakingHistory/StakingHistory.types';

import { ActionsType } from '../types';
import {
  handleSetCallError,
  handleUpdateCallStatus,
  handleUpdateStepData,
  handleUpdateSteps,
} from '../utils/utils.reducers';
import { StepCallsActions } from '../utils/utils.types';
import {
  AddNewStakeCalls,
  FishTokenInfo,
  IncreaseCalls,
  StakeConstants,
  StakeListItem,
  StakingState,
} from './staking.state';

const initialState = { ...new StakingState() };

type IncreaseActions = StepCallsActions<IncreaseCalls>;
type AddStakeActions = StepCallsActions<AddNewStakeCalls>;

export const stakingSlice = createSlice({
  name: Reducers.Staking,
  initialState,
  reducers: {
    // ----- add new stake call -----

    addNewStake: (state, _: PayloadAction<AddNewStakeFormValues>) => {
      state.addNewStakeCall = initialState.addNewStakeCall;
    },
    resetAddNewStake: (state) => {
      state.addNewStakeCall = initialState.addNewStakeCall;
    },
    setAddStakeStatus: (state, { payload }: AddStakeActions['setStatus']) => {
      state.addNewStakeCall = handleUpdateCallStatus(
        state.addNewStakeCall,
        payload
      );
    },
    setAddStakeSteps: (state, { payload }: AddStakeActions['setSteps']) => {
      state.addNewStakeCall = handleUpdateSteps(state.addNewStakeCall, payload);
    },
    setAddStakeStepData: (
      state,
      { payload }: AddStakeActions['updateStep']
    ) => {
      state.addNewStakeCall = handleUpdateStepData(
        state.addNewStakeCall,
        payload
      );
    },
    setAddStakeError: (state, { payload }: AddStakeActions['setError']) => {
      state.addNewStakeCall = handleSetCallError(
        state.addNewStakeCall,
        payload
      );
    },

    // ----- increase stake call -----

    increaseStake: (state, _: PayloadAction<IncreaseStakeFormValues>) => {
      state.increaseCall = initialState.increaseCall;
    },
    resetIncrease: (state) => {
      state.increaseCall = initialState.increaseCall;
    },
    setIncreaseStatus: (state, { payload }: IncreaseActions['setStatus']) => {
      state.increaseCall = handleUpdateCallStatus(state.increaseCall, payload);
    },
    setIncreaseSteps: (state, { payload }: IncreaseActions['setSteps']) => {
      state.increaseCall = handleUpdateSteps(state.increaseCall, payload);
    },
    setIncreaseStepData: (
      state,
      { payload }: IncreaseActions['updateStep']
    ) => {
      state.increaseCall = handleUpdateStepData(state.increaseCall, payload);
    },
    setIncreaseError: (state, { payload }: IncreaseActions['setError']) => {
      state.increaseCall = handleSetCallError(state.increaseCall, payload);
    },

    watchStakingData: (_) => {},
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
      state.stakesListHistory.state = 'loading';
      state.fishToken.data = {};
      state.combinedVotingPower.data = undefined;
      state.stakesList.data = [];
      state.stakesListHistory.data = [];
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
