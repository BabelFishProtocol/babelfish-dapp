import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { StakingState } from './staking.state';

const initialState = { ...new StakingState() };

export const stakingSlice = createSlice({
  name: Reducers.Staking,
  initialState,
  reducers: {
    watchStakingData: (_) => {},
    stopWatchingStakingData: (state) => {
      state.kickoffTs.state = 'idle';
      state.totalStaked.state = 'idle';
      state.combinedVotingPower.state = 'idle';
    },
    fetchStakingData: (state) => {
      state.kickoffTs.state = 'loading';
      state.totalStaked.state = 'loading';
      state.combinedVotingPower.state = 'loading';
    },

    fetchTotalStakedFailure: (state) => {
      state.totalStaked.state = 'failure';
      state.totalStaked.data = undefined;
    },
    setTotalStaked: (state, { payload }: PayloadAction<string>) => {
      state.totalStaked.state = 'success';
      state.totalStaked.data = payload;
    },

    fetchKickoffTsFailure: (state) => {
      state.kickoffTs.state = 'failure';
      state.kickoffTs.data = undefined;
    },
    setKickoffTs: (state, { payload }: PayloadAction<number>) => {
      state.kickoffTs.state = 'success';
      state.kickoffTs.data = payload;
    },

    fetchVotingPowerFailure: (state) => {
      state.combinedVotingPower.state = 'failure';
      state.combinedVotingPower.data = undefined;
    },
    setVotingPower: (state, { payload }: PayloadAction<string>) => {
      state.combinedVotingPower.state = 'success';
      state.combinedVotingPower.data = payload;
    },

    selectStake: (state, { payload }: PayloadAction<number>) => {
      state.selectedStake = payload;
    },
    clearSelectedStake: (state) => {
      state.selectedStake = undefined;
    },
    selectVest: (state, { payload }: PayloadAction<number>) => {
      state.selectedVest = payload;
    },
    clearSelectedVest: (state) => {
      state.selectedVest = undefined;
    },
  },
});

const { actions: stakingActions, reducer: stakingReducer } = stakingSlice;
export { stakingActions, stakingReducer };

export type StakingActions = ActionsType<typeof stakingActions>;
