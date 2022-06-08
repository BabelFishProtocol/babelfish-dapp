import { put, call, select, take } from 'typed-redux-saga';

import { GovernorAlpha } from '../../../contracts/types';
import { subscriptionSaga } from '../../utils/utils.sagas';
import { compareAddresses } from '../../../utils/helpers';
import {
  findAllProposalsSubscription,
  ProposalListQueryItem,
  ProposalListQueryResult,
} from '../../../queries/proposalListQuery';

import {
  currentBlockSelector,
  governorAdminSelector,
  governorOwnerSelector,
  multicallProviderSelector,
} from '../../app/app.selectors';
import { appActions } from '../../app/app.slice';

import { governorContractsSelector } from '../proposals.selectors';
import { Proposal } from '../proposals.state';

import { parseProposals } from '../proposals.utils';
import { proposalsActions } from '../proposals.slice';
import { fetchProposalStates } from './utils';
import { SubscriptionResponse } from '../../types';

export function* fetchProposalsForContract(
  governor: GovernorAlpha,
  proposals: ProposalListQueryItem[]
) {
  const multicallProvider = yield* select(multicallProviderSelector);
  const governorsAddresses = yield* select(governorContractsSelector);

  const governorProposals = proposals.filter(({ contractAddress }) =>
    compareAddresses(contractAddress, governor.address)
  );

  if (!multicallProvider || !governorsAddresses)
    throw new Error('Wallet not connected!');

  const proposalsStates = yield* fetchProposalStates(
    governorProposals,
    governor,
    multicallProvider
  );

  const parsedProposals = yield* call(
    parseProposals,
    governorProposals,
    proposalsStates,
    governorsAddresses
  );

  return parsedProposals;
}

/** Wait for the node to sync with the latest proposal creation block to prevent errors */
export function* syncAllProposals([
  latestProposal,
]: ProposalListQueryResult['proposals']) {
  const latestProposalBlock = Number(latestProposal.createdAt);

  let currBlock = (yield* select(currentBlockSelector)) || 0;
  while (!currBlock || latestProposalBlock > currBlock) {
    yield* take(appActions.setBlockNumber.type);
    currBlock = (yield* select(currentBlockSelector)) as number;
  }
}

export function* triggerFetchProposalsList(
  result: SubscriptionResponse<ProposalListQueryResult>
) {
  try {
    yield* put(proposalsActions.updateProposalsList());
    if (result.isError) throw result.error;

    const governorAdmin = yield* select(governorAdminSelector);
    const governorOwner = yield* select(governorOwnerSelector);

    if (!governorAdmin) throw new Error('Wallet not connected');

    const proposals = result.data?.proposals || [];

    yield* call(syncAllProposals, proposals);

    const adminItems = yield* call(
      fetchProposalsForContract,
      governorAdmin,
      proposals
    );

    let ownerItems: Proposal[] = [];

    if (
      governorOwner &&
      !compareAddresses(governorOwner.address, governorAdmin.address)
    ) {
      ownerItems = yield* call(
        fetchProposalsForContract,
        governorOwner,
        proposals
      );
    }

    const mergedProposals = [...adminItems, ...ownerItems].sort(
      (a, b) => b.startBlock - a.startBlock
    );

    yield* put(proposalsActions.setProposalsList(mergedProposals));
  } catch (e) {
    yield* put(proposalsActions.fetchProposalsListFailure());
  }
}

export function* watchProposalsList() {
  yield* subscriptionSaga<ProposalListQueryResult>({
    fetchSaga: triggerFetchProposalsList,
    query: findAllProposalsSubscription,
    watchDataAction: proposalsActions.watchProposalsList,
    stopAction: proposalsActions.stopWatchingProposalsList,
  });
}
