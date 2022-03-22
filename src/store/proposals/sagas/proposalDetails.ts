import { put, select, call } from 'typed-redux-saga';
import { ProposalState } from '../../../constants';
import { proposalDetailsQuery } from '../../../queries/proposalDetailsQuery';
import { subgraphClientSelector } from '../../app/app.selectors';

import { createWatcherSaga } from '../../utils';
import {
  selectedProposalGovernor,
  selectedProposalSelector,
} from '../proposals.selectors';

import { proposalsActions } from '../proposals.slice';
import { ProposalDetails } from '../proposals.state';
import { parseProposal } from '../proposals.utils';

/**
 * figure out a way to get proposal id and contract address (governorAdmin vs governorOwner) - git
 * create selectedProposal state and populate in on page load, add both address and id to url? - git
 * add calldata, figure out good way to make all containers the same height
 */

export function* fetchProposalDetails() {
  try {
    const { id: proposalId, contractAddress: proposalAddress } = yield* select(
      selectedProposalSelector
    );
    const subgraphClient = yield* select(subgraphClientSelector);
    const governorContract = yield* select(selectedProposalGovernor);

    if (
      !proposalId ||
      !governorContract ||
      !proposalAddress ||
      !subgraphClient
    ) {
      throw new Error('Missing proposal data');
    }

    const results = yield* call(proposalDetailsQuery, subgraphClient, {
      proposalId,
      contractAddress: proposalAddress,
    });

    const [proposalDetails] = results.proposals;

    const proposalState = yield* call(governorContract.state, proposalId);

    const baseProposal = parseProposal(
      proposalDetails,
      proposalState as unknown as ProposalState
    );

    const parsedProposal: ProposalDetails = {
      ...proposalDetails,
      ...baseProposal,
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

export const watchProposalsDetails = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: proposalsActions.stopWatchingDetails.type,
});
