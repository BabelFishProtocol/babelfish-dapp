import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { AddProposalFields } from '../../pages/AddProposal/AddProposal.types';
import { ActionsType } from '../types';
import { ProposalState } from './proposal.state';

const initialState = { ...new ProposalState() };

export const proposalSlice = createSlice({
  name: Reducers.Proposal,
  initialState,
  reducers: {
    startProposal: (state, { payload }: PayloadAction<AddProposalFields>) => {
      state.constants.state = 'loading';
      state.proposalValues = payload;
    },
    porposalFailure: (state, { payload }: PayloadAction<string>) => {
      state.constants.state = 'failure';
      state.errorReason = payload;
    },
    proposalSuccess: (state) => {
      state.constants.state = 'success';
    },
  },
});

const { actions: proposalActions, reducer: proposalReducer } = proposalSlice;
export { proposalActions, proposalReducer };

export type ProposalActions = ActionsType<typeof proposalActions>;
