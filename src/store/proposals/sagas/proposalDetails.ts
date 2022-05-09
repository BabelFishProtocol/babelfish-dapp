import { put, select, call } from 'typed-redux-saga';

import { ProposalState } from '../../../constants';
import { createWatcherSaga } from '../../utils/utils.sagas';
import { proposalDetailsQuery } from '../../../queries/proposalDetailsQuery';
import { subgraphClientSelector } from '../../app/app.selectors';

import {
  governorContractsSelector,
  selectedProposalGovernor,
  selectedProposalSelector,
} from '../proposals.selectors';
import { parseProposal } from '../proposals.utils';
import { ProposalDetails } from '../proposals.state';
import { proposalsActions } from '../proposals.slice';

export function* fetchProposalDetails() {
  try {
    const selectedProposal = yield* select(selectedProposalSelector);
    const subgraphClient = yield* select(subgraphClientSelector);
    const governorContract = yield* select(selectedProposalGovernor);
    const governorAddresses = yield* select(governorContractsSelector);

    if (
      !selectedProposal ||
      !governorContract ||
      !subgraphClient ||
      !governorAddresses
    ) {
      throw new Error('Missing proposal data');
    }

    const { id: proposalId, contractAddress } = selectedProposal;

    const { proposals } = yield* call(proposalDetailsQuery, subgraphClient, {
      proposalId,
      contractAddress,
    });

    const [proposalDetails] = proposals;

    const proposalState = yield* call(governorContract.state, proposalId);
    const guardian = yield* call(governorContract.guardian);

    const baseProposal = parseProposal(
      proposalDetails,
      proposalState as unknown as ProposalState,
      governorAddresses
    );

    const {
      eta,
      votes,
      actions,
      proposer,
      description,
      forVotesAmount,
      againstVotesAmount,
    } = proposalDetails;

    const parsedProposal: ProposalDetails = {
      ...baseProposal,
      eta,
      votes,
      actions,
      proposer,
      guardian,
      description,
      forVotesAmount,
      againstVotesAmount,
    };

    yield* put(proposalsActions.setDetails(parsedProposal));
  } catch (e) {
    yield* put(proposalsActions.fetchDetailsFailure());
  }
}

function* triggerFetch() {
  yield* put(proposalsActions.fetchDetails());
}

function* triggerUpdate() {
  yield* put(proposalsActions.updateDetails());
}

export const watchProposalDetails = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: proposalsActions.stopWatchingDetails.type,
});
