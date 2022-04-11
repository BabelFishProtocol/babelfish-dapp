import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { AddNewStakeFormValues } from '../../pages/Staking/AddNewStake/AddNewStake.types';
import { StakingHistoryListItem } from '../../pages/Staking/StakingHistory/StakingHistory.types';

import { ActionsType } from '../types';
import {
  AddNewStakeCalls,
  CallState,
  FishTokenInfo,
  StakeConstants,
  StakeListItem,
  StakingState,
  StepData,
} from './staking.state';

const initialState = { ...new StakingState() };

type SetAddStakeStatusPayload = Pick<
  CallState<AddNewStakeCalls>,
  'status' | 'currentOperation'
>;

export const stakingSlice = createSlice({
  name: Reducers.Staking,
  initialState,
  reducers: {
    addNewStake: (state, _: PayloadAction<AddNewStakeFormValues>) => {
      state.addNewStakeCall = initialState.addNewStakeCall;
    },
    setAddStakeStatus: (
      state,
      { payload }: PayloadAction<SetAddStakeStatusPayload>
    ) => {
      state.addNewStakeCall.status = payload.status;
      state.addNewStakeCall.currentOperation = payload.currentOperation;
    },
    setAddStakeStateCurrentCallData: (
      state,
      { payload }: PayloadAction<Partial<StepData<AddNewStakeCalls>>>
    ) => {
      if (state.addNewStakeCall.currentOperation) {
        state.addNewStakeCall.steps[state.addNewStakeCall.currentOperation] = {
          ...state.addNewStakeCall.steps[
            state.addNewStakeCall.currentOperation
          ],
          ...payload,
        };
      }
    },
    setAddStakeError: (state, { payload }: PayloadAction<Partial<string>>) => {
      state.addNewStakeCall.status = 'failure';

      if (state.addNewStakeCall.currentOperation) {
        state.addNewStakeCall.steps[
          state.addNewStakeCall.currentOperation
        ].error = payload;
      }
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
