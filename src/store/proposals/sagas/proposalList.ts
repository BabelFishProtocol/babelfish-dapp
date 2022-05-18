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

export function* fetchProposalsForContract(
  governor: GovernorAlpha,
  proposals: ProposalListQueryItem[]
) {
  const multicallProvider = yield* select(multicallProviderSelector);
  const governorsAddresses = yield* select(governorContractsSelector);

  if (!multicallProvider || !governorsAddresses)
    throw new Error('Wallet not connected!');

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

function* triggerFetch(data: ProposalListQueryResult | Error) {
  try {
    const governorAdmin = yield* select(governorAdminSelector);
    const governorOwner = yield* select(governorOwnerSelector);

    yield* put(proposalsActions.updateProposalsList());
    yield* take(appActions.setBlockNumber.type);

    if (!governorAdmin) throw new Error('Wallet not connected');
    if (data instanceof Error) throw data;

    const adminProposals = data.proposals.filter(({ contractAddress }) =>
      compareAddresses(contractAddress, governorAdmin.address)
    );

    const adminItems = yield* call(
      fetchProposalsForContract,
      governorAdmin,
      adminProposals
    );

    let ownerItems: Proposal[] = [];

    if (governorOwner && governorOwner.address !== governorAdmin.address) {
      const ownerProposals = data.proposals.filter(({ contractAddress }) =>
        compareAddresses(contractAddress, governorOwner.address)
      );

      ownerItems = yield* call(
        fetchProposalsForContract,
        governorOwner,
        ownerProposals
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
  yield* subscriptionSaga({
    fetchSaga: triggerFetch,
    query: findAllProposalsSubscription,
    stopAction: proposalsActions.stopWatchingProposalsList,
  });
}
