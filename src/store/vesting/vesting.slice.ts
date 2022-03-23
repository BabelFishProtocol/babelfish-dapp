import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { VestingState, VestListItem } from './vesting.state';

const initialState = { ...new VestingState() };

export const vestingSlice = createSlice({
  name: Reducers.Vesting,
  initialState,
  reducers: {
    watchVestingData: (_) => {},
    stopWatchingVestingData: (state) => {
      state.vestsList.state = 'idle';
    },
    fetchVestingData: (state) => {
      state.vestsList.state = 'loading';
      state.vestsList.data = [];
    },
    updateVestingData: (state) => {
      state.vestsList.state = 'loading';
    },

    fetchVestsListFailure: (state) => {
      state.vestsList.data = [];
      state.vestsList.state = 'failure';
    },

    setVestsList: (state, { payload }: PayloadAction<VestListItem[]>) => {
      state.vestsList.data = payload;
      state.vestsList.state = 'success';
    },

    selectVest: (state, { payload }: PayloadAction<number>) => {
      state.selectedVest = payload;
    },
    clearSelectedVest: (state) => {
      state.selectedVest = undefined;
    },
  },
});

const { actions: vestingActions, reducer: vestingReducer } = vestingSlice;
export { vestingActions, vestingReducer };

export type VestingActions = ActionsType<typeof vestingActions>;
