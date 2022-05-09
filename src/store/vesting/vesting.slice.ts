import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { DelegateVestValues } from '../../pages/Staking/VestsList/DelegateVest/DelegateVest.fields';
import { ActionsType } from '../types';
import { createStepCallsActions } from '../utils/utils.reducers';
import { VestingState, VestListItem } from './vesting.state';

const initialState = { ...new VestingState() };

const delegateVestStepCallActions = createStepCallsActions(
  initialState,
  'delegateCall'
);

export const vestingSlice = createSlice({
  name: Reducers.Vesting,
  initialState,
  reducers: {
    // ----- delegate vest call -----

    delegateVest: delegateVestStepCallActions.trigger<DelegateVestValues>(),
    resetDelegateVest: delegateVestStepCallActions.reset,
    setDelegateStatus: delegateVestStepCallActions.setStatus,
    setDelegateSteps: delegateVestStepCallActions.setSteps,
    setDelegateStepData: delegateVestStepCallActions.updateStep,
    setDelegateError: delegateVestStepCallActions.setStepError,

    watchVestingData: (state) => {
      state.vestsList.state = 'loading';
    },
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
      const selectedVest = state.vestsList.data.find(
        (vest) => vest.unlockDate === payload
      );
      state.selectedVest = selectedVest;
    },
    clearSelectedVest: (state) => {
      state.selectedVest = undefined;
    },
  },
});

const { actions: vestingActions, reducer: vestingReducer } = vestingSlice;
export { vestingActions, vestingReducer };

export type VestingActions = ActionsType<typeof vestingActions>;
