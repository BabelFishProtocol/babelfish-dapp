import { BigNumberish, BytesLike } from 'ethers';
import { Provider as MulticallProvider } from 'ethers-multicall';
import { all, put, call, select, takeLatest } from 'typed-redux-saga';

import { GovernorAlpha } from '../../contracts/types';
import { convertForMulticall, createWatcherSaga } from '../utils';

import {
  ProposalListQueryItem,
  proposalsListQuery,
} from '../../queries/proposalListQuery';

import {
  providerSelector,
  governorAdminSelector,
  governorOwnerSelector,
  subgraphClientSelector,
  multicallProviderSelector,
  accountSelector,
  stakingContractSelector,
} from '../app/app.selectors';

import { Proposal } from './proposals.state';
import { parseProposals } from './proposals.utils';
import { ProposalsActions, proposalsActions } from './proposals.slice';
import { AddProposalInputs } from '../../pages/AddProposal/AddProposal.fields';
import { GOVERNANCE_OPTIONS } from '../../constants';

type ProposalStateResult = Awaited<ReturnType<GovernorAlpha['state']>>;

function* fetchProposalStates(
  proposals: ProposalListQueryItem[],
  governor: GovernorAlpha,
  multicallProvider: MulticallProvider
) {
  const proposalStateCalls = proposals.map(({ proposalId }) =>
    convertForMulticall(governor, 'state', 'state(uint256)', proposalId)
  );

  const proposalsStates: ProposalStateResult[] = yield* call(
    [multicallProvider, multicallProvider.all],
    proposalStateCalls
  );

  return proposalsStates;
}

export function* fetchProposalsForContract(governor: GovernorAlpha) {
  const provider = yield* select(providerSelector);
  const multicallProvider = yield* select(multicallProviderSelector);
  const subgraphClient = yield* select(subgraphClientSelector);

  if (!provider || !subgraphClient || !multicallProvider)
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
    proposalsStates
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

const watchProposalsList = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: proposalsActions.stopWatchingProposalsList.type,
});

export function* addProposal({ payload }: ProposalsActions['startProposal']) {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);
    const isGovAdmin =
      payload[AddProposalInputs.SendProposalContract] ===
      GOVERNANCE_OPTIONS.GOVERNER_ADMIN.id;

    const govSelector = isGovAdmin
      ? governorAdminSelector
      : governorOwnerSelector;

    const governor = yield* select(govSelector);

    if (!account || !governor || !staking) {
      throw new Error('Wallet not connected');
    }

    const threshold = yield* call(governor.proposalThreshold);
    const votes = yield* call(staking.getCurrentVotes, account);

    if (threshold.gt(votes)) {
      throw new Error(
        `Your voting power must be at least ${threshold} to make a proposal`
      );
    }

    const rows = payload[AddProposalInputs.Values];

    const targets = rows.map((row) => row[AddProposalInputs.Target]);
    const values: BigNumberish[] = rows.map(
      (row) => row[AddProposalInputs.Value]
    );
    const signatures = rows.map((row) => row[AddProposalInputs.Signature]);
    const calldatas: BytesLike[] = rows.map(
      (row) => row[AddProposalInputs.Signature]
    );
    const description = payload[AddProposalInputs.Description];

    const tx = yield* call(
      governor.propose,
      targets,
      values,
      signatures,
      calldatas,
      description
    );
    yield* call(tx.wait);
    yield* put(proposalsActions.proposalSuccess());
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : 'There was some error in Adding the proposal. Please try again';

    yield* put(proposalsActions.porposalFailure(msg));
  }
}

export function* proposalsSaga() {
  yield* all([
    takeLatest(proposalsActions.fetchProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.updateProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.watchProposalsList.type, watchProposalsList),
    takeLatest(proposalsActions.startProposal, addProposal),
  ]);
}
