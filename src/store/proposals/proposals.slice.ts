import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { AddProposalFields } from '../../pages/AddProposal/AddProposal.types';
import { FiniteStates } from '../../utils/types';
import { ActionsType } from '../types';
import { createStepCallsActions } from '../utils/utils.reducers';
import {
  Proposal,
  ProposalDetails,
  ProposalsState,
  ProposalUrlParams,
} from './proposals.state';

const initialState = { ...new ProposalsState() };

const voteCallActions = createStepCallsActions(initialState, 'voteCall');

export const proposalSlice = createSlice({
  name: Reducers.Proposals,
  initialState,
  reducers: {
    // ----- proposal details calls -----

    castVote: voteCallActions.trigger<{ support: boolean }>(),
    resetVoteCall: voteCallActions.reset,
    setVoteCallStatus: voteCallActions.setStatus,
    setVoteCallStepData: voteCallActions.updateStep,
    setVoteCallSteps: voteCallActions.setSteps,
    setVoteCallError: voteCallActions.setStepError,

    watchProposalsList: (state) => {
      state.proposalsList.state = 'loading';
    },
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
      state.selectedProposal = undefined;
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
    setGovernor: (state, { payload }: PayloadAction<string>) => {
      state.selectedGovernor = payload;
    },
    watchAddProposal: () => {},
    stopWatchingAddProposal: (state) => {
      state.addProposalState = 'idle';
    },
    checkAddProposal: () => {},
    eligibleForAddProposal: (state) => {
      state.reasonToBlockProposal = undefined;
    },
    notEligibleForAddProposal: (state, { payload }: PayloadAction<string>) => {
      state.reasonToBlockProposal = payload;
    },
    startProposal: (state, _: PayloadAction<AddProposalFields>) => {
      state.addProposalState = 'loading';
    },
    proposalFailure: (state, { payload }: PayloadAction<string>) => {
      state.addProposalState = 'failure';
      state.addProposalErrorReason = payload;
    },
    proposalSuccess: (state) => {
      state.addProposalState = 'success';
    },
    setAddProposalState: (state, { payload }: PayloadAction<FiniteStates>) => {
      state.addProposalState = payload;
      state.reasonToBlockProposal = undefined;
    },
  },
});

const { actions: proposalsActions, reducer: proposalsReducer } = proposalSlice;
export { proposalsActions, proposalsReducer };

export type ProposalsActions = ActionsType<typeof proposalsActions>;
