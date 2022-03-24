import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { AddProposalFields } from '../../pages/AddProposal/AddProposal.types';
import { FiniteStates } from '../../utils/types';
import { ActionsType } from '../types';
import { Proposal, ProposalDetails, ProposalsState } from './proposals.state';

const initialState = { ...new ProposalsState() };

type ProposalUrlParams = Partial<Pick<Proposal, 'id' | 'contractAddress'>>;

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

    watchDetails: (state, { payload }: PayloadAction<ProposalUrlParams>) => {
      state.selectedProposal = payload;
    },
    stopWatchingDetails: (state) => {
      state.proposalDetails.state = 'idle';
      state.selectedProposal = {};
    },
    fetchDetails: (state) => {
      state.proposalDetails = {
        data: undefined,
        state: 'loading',
      };
    },
    updateDetails: (state) => {
      state.proposalDetails.state = 'loading';
    },
    fetchDetailsFailure: (state) => {
      state.proposalDetails = {
        data: undefined,
        state: 'failure',
      };
    },
    setDetails: (state, { payload }: PayloadAction<ProposalDetails>) => {
      state.proposalDetails = {
        data: payload,
        state: 'success',
      };
    },

    startProposal: (state, _: PayloadAction<AddProposalFields>) => {
      state.addProposalState = 'loading';
    },
    porposalFailure: (state, { payload }: PayloadAction<string>) => {
      state.addProposalState = 'failure';
      state.addProposalErrorReason = payload;
    },
    proposalSuccess: (state) => {
      state.addProposalState = 'success';
    },
    setAddProposalState: (state, { payload }: PayloadAction<FiniteStates>) => {
      state.addProposalState = payload;
    },
  },
});

const { actions: proposalsActions, reducer: proposalsReducer } = appSlice;
export { proposalsActions, proposalsReducer };

export type ProposalsActions = ActionsType<typeof proposalsActions>;
