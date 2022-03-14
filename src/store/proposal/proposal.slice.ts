import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import {
  ProposalGovernorInput,
  ProposalState,
  ProposalThresholdState,
} from './proposal.state';

const initialState = { ...new ProposalState() };

export const proposalSlice = createSlice({
  name: Reducers.Proposal,
  initialState,
  reducers: {
    startFetchThreshold: (
      state,
      { payload }: PayloadAction<ProposalGovernorInput>
    ) => {
      state.constants.state = 'loading';
      state.selectedGovernorType = payload.governorType;
    },
    fetchThresholdFailure: (state) => {
      state.constants.state = 'failure';
    },
    setThreshold: (
      state,
      { payload }: PayloadAction<ProposalThresholdState>
    ) => {
      state.constants.state = 'success';
      state.threshold = payload.threshold;
    },
  },
});

const { actions: proposalActions, reducer: proposalReducer } = proposalSlice;
export { proposalActions, proposalReducer };

export type ProposalActions = ActionsType<typeof proposalActions>;
