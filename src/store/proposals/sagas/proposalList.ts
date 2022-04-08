import { put, call, select } from 'typed-redux-saga';

import { GovernorAlpha } from '../../../contracts/types';
import { createWatcherSaga } from '../../utils';

import { proposalsListQuery } from '../../../queries/proposalListQuery';

import {
  providerSelector,
  governorAdminSelector,
  governorOwnerSelector,
  subgraphClientSelector,
  multicallProviderSelector,
} from '../../app/app.selectors';

import { Proposal } from '../proposals.state';
import { parseProposals } from '../proposals.utils';
import { proposalsActions } from '../proposals.slice';
import { governorContractsSelector } from '../proposals.selectors';
import { fetchProposalStates } from './utils';

export function* fetchProposalsForContract(governor: GovernorAlpha) {
  const provider = yield* select(providerSelector);
  const multicallProvider = yield* select(multicallProviderSelector);
  const subgraphClient = yield* select(subgraphClientSelector);
  const governorsAddresses = yield* select(governorContractsSelector);

  if (!provider || !subgraphClient || !multicallProvider || !governorsAddresses)
    throw new Error('Wallet not connected!');

  const { proposals } = yield* call(proposalsListQuery, subgraphClient, {
    contractAddress: governor.address,
  });

  const proposalsStates = yield* fetchProposalStates(
    proposals,
    governor,
    multicallProvider
  );

  const parsedProposals = yield* call(
    parseProposals,
    proposals,
    proposalsStates,
    governorsAddresses
  );

  return parsedProposals;
}

export function* fetchProposalsList() {
  try {
    const governorAdmin = yield* select(governorAdminSelector);
    const governorOwner = yield* select(governorOwnerSelector);

    if (!governorAdmin) {
      throw new Error('Wallet not connected');
    }

    const adminItems = yield* call(fetchProposalsForContract, governorAdmin);

    let ownerItems: Proposal[] = [];

    if (governorOwner && governorOwner.address !== governorAdmin.address) {
      ownerItems = yield* call(fetchProposalsForContract, governorOwner);
    }

    const mergedProposals = [...adminItems, ...ownerItems].sort(
      (a, b) => b.startBlock - a.startBlock
    );

    yield* put(proposalsActions.setProposalsList(mergedProposals));
  } catch (e) {
    yield* put(proposalsActions.fetchProposalsListFailure());
  }
}

function* triggerFetch() {
  yield* put(proposalsActions.fetchProposalsList());
}

function* triggerUpdate() {
  yield* put(proposalsActions.updateProposalsList());
}

export const watchProposalsList = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: proposalsActions.stopWatchingProposalsList.type,
});
