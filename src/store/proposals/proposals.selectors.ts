import { createSelector } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { RootState } from '..';
import { GovernorTypes, Reducers } from '../../constants';
import { GovernorAlpha__factory } from '../../contracts/types';
import { FiniteStates } from '../../utils/types';
import { compareAddresses } from '../../utils/helpers';
import { selectCurrentCallStepData } from '../utils/utils.selectors';
import {
  accountSelector,
  addressesSelector,
  providerSelector,
} from '../app/app.selectors';
import { VoteType } from './proposals.types';

const proposalsState = (state: RootState) => state[Reducers.Proposals];

export const proposalsListSelector = createSelector(
  proposalsState,
  (state) => state.proposalsList
);

export const governorContractsSelector = createSelector(
  addressesSelector,
  (addresses) => {
    if (!addresses) return undefined;

    return {
      [GovernorTypes.GovernorOwner]: addresses.governorOwner,
      [GovernorTypes.GovernorAdmin]: addresses.governorAdmin,
    };
  }
);

export const selectedProposalSelector = createSelector(
  [proposalsState, governorContractsSelector],

  ({ selectedProposal }, governorAddresses) => {
    if (!selectedProposal || !governorAddresses) {
      return undefined;
    }

    return {
      ...selectedProposal,
      contractAddress: governorAddresses[selectedProposal.governorType],
    };
  }
);

export const selectedProposalGovernor = createSelector(
  [selectedProposalSelector, providerSelector],
  (selectedProposal, provider) => {
    if (!selectedProposal || !provider) return undefined;

    return GovernorAlpha__factory.connect(
      selectedProposal.contractAddress,
      provider.getSigner()
    );
  }
);

export const proposalDetailsSelector = createSelector(
  proposalsState,
  (state) => state.proposalDetails
);
export const proposalDetailsStateSelector = createSelector(
  proposalDetailsSelector,
  ({ state }) => state
);

export const proVotesSelector = createSelector(
  proposalDetailsSelector,
  ({ data }) => {
    if (!data) return [];

    return data.votes.filter((vote) => vote.isPro);
  }
);

export const againstVotesSelector = createSelector(
  proposalDetailsSelector,
  ({ data }) => {
    if (!data) return [];

    return data.votes.filter((vote) => !vote.isPro);
  }
);

export const hasVotesSelector = createSelector(
  proposalDetailsSelector,
  ({ data }) => (data ? !!data.votes.length : undefined)
);

export const votesRatioSelector = createSelector(
  [hasVotesSelector, proposalDetailsSelector],
  (hasVotes, { data }) => {
    if (!data || !hasVotes) return undefined;

    const forAmount = BigNumber.from(data.forVotesAmount);
    const againstAmount = BigNumber.from(data.againstVotesAmount);

    if (againstAmount.isZero() && forAmount.isZero()) {
      return 0;
    }
    if (againstAmount.isZero()) {
      return 100;
    }

    const votesSum = forAmount.add(againstAmount);

    const ratioPrecision = 100000;

    const ratio = BigNumber.from(forAmount)
      .mul(ratioPrecision)
      .div(votesSum)
      .toNumber();

    const ratioInPercents = ratio / (ratioPrecision / 100);

    return ratioInPercents;
  }
);

export const isGuardianSelector = createSelector(
  [proposalDetailsSelector, accountSelector],
  (proposal, account) => {
    if (!proposal.data || !account) {
      return undefined;
    }

    return compareAddresses(proposal.data.guardian, account);
  }
);

export const selectedProposalIdSelector = createSelector(
  proposalDetailsSelector,
  (proposal) => (proposal.data ? proposal.data.id : undefined)
);

/**
 * Status of user vote for selected proposal
 * - for: User has a vote supporting the proposal
 * - against: User has a vote against the proposal
 * - undefined: User didn't cast any vote
 */
export const userVoteTypeSelector = createSelector(
  [proVotesSelector, againstVotesSelector, accountSelector],
  (proVotes, againstVotes, account): VoteType => {
    if (!account) return undefined;

    if (proVotes.some((vote) => compareAddresses(vote.voter, account))) {
      return 'for';
    }

    if (againstVotes.some((vote) => compareAddresses(vote.voter, account))) {
      return 'against';
    }

    return undefined;
  }
);

export const addProposalStateSelector = createSelector(
  proposalsState,
  (state) => state.addProposalState
);

export const addProposalErrorSelector = createSelector(
  proposalsState,
  (state) => state.addProposalErrorReason
);

export const reasonToBlockSelector = createSelector(
  proposalsState,
  (state) => state.reasonToBlockProposal
);

export const selectedGovernorSelector = createSelector(
  proposalsState,
  (state) => state.selectedGovernor
);

const voteCall = createSelector(proposalsState, (state) => state.voteCall);
export const voteCallStatusSelector = createSelector(voteCall, (state) =>
  selectCurrentCallStepData(state)
);
export const forVoteStatusSelector = createSelector(
  voteCall,
  (state): FiniteStates =>
    state.currentOperation === 'vote for' ? state.status : 'idle'
);
export const againstVoteStatusSelector = createSelector(
  voteCall,
  (state): FiniteStates =>
    state.currentOperation === 'vote against' ? state.status : 'idle'
);
