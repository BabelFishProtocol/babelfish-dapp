import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { AddProposalFields } from '../../pages/AddProposal/AddProposal.types';
// import { FiniteStates } from '../../utils/types';
import { ActionsType } from '../types';
import { createStepCallsActions } from '../utils/utils.reducers';
import {
  Proposal,
  ProposalDetails,
  ProposalsState,
  ProposalUrlParams,
} from './proposals.state';

const initialState = { ...new ProposalsState() };

const addProposalStepCallActions = createStepCallsActions(
  initialState,
  'addProposalCall'
);

export const proposalSlice = createSlice({
  name: Reducers.Proposals,
  initialState,
  reducers: {
    // ----- add new stake call -----

    addProposal: addProposalStepCallActions.trigger<AddProposalFields>(),
    resetProposal: addProposalStepCallActions.reset,
    setAddProposalStatus: addProposalStepCallActions.setStatus,
    setAddProposalSteps: addProposalStepCallActions.setSteps,
    setAddProposalStepData: addProposalStepCallActions.updateStep,
    setAddProposalError: addProposalStepCallActions.setStepError,

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
    checkAddProposal: () => {},
    eligibleForAddProposal: (state) => {
      state.reasonToBlockProposal = undefined;
    },
    notEligibleForAddProposal: (state, { payload }: PayloadAction<string>) => {
      state.reasonToBlockProposal = payload;
    },
    clearReasonToBlockState: (state) => {
      state.reasonToBlockProposal = undefined;
    },
  },
});

const { actions: proposalsActions, reducer: proposalsReducer } = proposalSlice;
export { proposalsActions, proposalsReducer };

export type ProposalsActions = ActionsType<typeof proposalsActions>;
