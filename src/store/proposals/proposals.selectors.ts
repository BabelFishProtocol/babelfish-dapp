import { createSelector } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { RootState } from '..';
import { Reducers } from '../../constants';
import { GovernorAlpha__factory } from '../../contracts/types';
import { providerSelector } from '../app/app.selectors';

const proposalsState = (state: RootState) => state[Reducers.Proposals];

export const proposalsListSelector = createSelector(
  proposalsState,
  (state) => state.proposalsList
);

export const selectedProposalSelector = createSelector(
  proposalsState,
  (state) => state.selectedProposal
);

export const selectedProposalGovernor = createSelector(
  [selectedProposalSelector, providerSelector],
  ({ contractAddress }, provider) => {
    if (!contractAddress || !provider) return undefined;

    return GovernorAlpha__factory.connect(
      contractAddress,
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

export const addProposalStateSelector = createSelector(
  proposalsState,
  (state) => state.addProposalState
);

export const addProposalErrorSelector = createSelector(
  proposalsState,
  (state) => state.addProposalErrorReason
);
