import { put, select, call, take } from 'typed-redux-saga';

import { ProposalState } from '../../../constants';
import { subscriptionSaga } from '../../utils/utils.sagas';
import {
  ProposalDetailsQueryParams,
  ProposalDetailsQueryResult,
  proposalDetailsSubscription,
} from '../../../queries/proposalDetailsQuery';

import {
  governorContractsSelector,
  selectedProposalGovernor,
  selectedProposalSelector,
} from '../proposals.selectors';
import { parseProposal } from '../proposals.utils';
import { ProposalDetails } from '../proposals.state';
import { proposalsActions } from '../proposals.slice';
import { SubscriptionResponse } from '../../types';
import { appActions } from '../../app/app.slice';

export function* fetchProposalDetails(
  queryResult: SubscriptionResponse<ProposalDetailsQueryResult>
) {
  try {
    yield* put(proposalsActions.fetchDetails());

    if (queryResult.isError) throw queryResult.error;

    const governorContract = yield* select(selectedProposalGovernor);
    const governorAddresses = yield* select(governorContractsSelector);

    if (!governorContract || !governorAddresses) {
      throw new Error('Missing proposal data');
    }

    const [proposalDetails] = queryResult.data.proposals || [];

    const proposalState = yield* call(
      governorContract.state,
      proposalDetails.proposalId
    );
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

/** Needed because update of proposal state will not trigger event in the subscription(proposal state is not tracked in our subgraph) */
export function* forceProposalReFetch() {
  yield* put(proposalsActions.stopWatchingDetails());
  yield* put(proposalsActions.watchDetails());
}

export function* watchProposalDetails() {
  let selectedProposal = yield* select(selectedProposalSelector);

  /** when proposal data is not settled wait for the wallet to be connected and try once again */
  if (!selectedProposal) {
    yield* take(appActions.walletConnected.type);
    selectedProposal = yield* select(selectedProposalSelector);

    if (!selectedProposal) {
      yield* put(proposalsActions.fetchDetailsFailure());
      return;
    }
  }

  const { id: proposalId, contractAddress } = selectedProposal;

  yield* subscriptionSaga<
    ProposalDetailsQueryResult,
    ProposalDetailsQueryParams
  >({
    query: proposalDetailsSubscription,
    variables: { contractAddress, proposalId },
    stopAction: proposalsActions.stopWatchingDetails,
    fetchSaga: fetchProposalDetails,
    watchDataAction: proposalsActions.watchDetails,
  });
}
