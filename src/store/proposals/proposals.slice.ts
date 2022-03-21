import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { Proposal, ProposalsState } from './proposals.state';

const initialState = { ...new ProposalsState() };

export const appSlice = createSlice({
  name: Reducers.Proposals,
  initialState,
  reducers: {
    watchProposalsList: () => {},
    stopWatchingProposalsList: (state) => {
      state.proposalsList.state = 'idle';
    },
    fetchProposalsList: (state) => {
      state.proposalsList.data = [];
      state.proposalsList.state = 'loading';
    },
    updateProposalsList: (state) => {
      state.proposalsList.state = 'loading';
    },
    fetchProposalsListFailure: (state) => {
      state.proposalsList.data = [];
      state.proposalsList.state = 'failure';
    },
    setProposalsList: (state, { payload }: PayloadAction<Proposal[]>) => {
      state.proposalsList.data = payload;
      state.proposalsList.state = 'success';
    },
  },
});

const { actions: proposalsActions, reducer: proposalsReducer } = appSlice;
export { proposalsActions, proposalsReducer };

export type ProposalsActions = ActionsType<typeof proposalsActions>;
