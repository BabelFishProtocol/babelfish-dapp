import { BigNumberish, BytesLike } from 'ethers';
import { put, call, select } from 'typed-redux-saga';

import { GOVERNANCE_OPTIONS, ProposalState } from '../../../constants';
import { AddProposalInputs } from '../../../pages/AddProposal/AddProposal.fields';
import { proposalsListQuery } from '../../../queries/proposalListQuery';

import {
  governorAdminSelector,
  governorOwnerSelector,
  accountSelector,
  stakingContractSelector,
  subgraphClientSelector,
  multicallProviderSelector,
} from '../../app/app.selectors';
import { createWatcherSaga } from '../../utils';
import { selectedGovernorSelector } from '../proposals.selectors';
import { ProposalsActions, proposalsActions } from '../proposals.slice';
import { fetchProposalStates } from './proposalList';

export function* addProposal({ payload }: ProposalsActions['startProposal']) {
  try {
    const account = yield* select(accountSelector);
    const isGovAdmin =
      payload[AddProposalInputs.SendProposalContract] ===
      GOVERNANCE_OPTIONS.GOVERNER_ADMIN.id;

    const govSelector = isGovAdmin
      ? governorAdminSelector
      : governorOwnerSelector;

    const governor = yield* select(govSelector);

    if (!account || !governor) {
      throw new Error('Wallet not connected');
    }

    const rows = payload[AddProposalInputs.Values];

    const targets = rows.map((row) => row[AddProposalInputs.Target]);
    const values: BigNumberish[] = rows.map(
      (row) => row[AddProposalInputs.Value]
    );
    const signatures = rows.map((row) => row[AddProposalInputs.Signature]);
    const calldatas: BytesLike[] = rows.map(
      (row) => row[AddProposalInputs.Calldata]
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

export function* checkAddEligibility() {
  const account = yield* select(accountSelector);
  const staking = yield* select(stakingContractSelector);
  const subgraphClient = yield* select(subgraphClientSelector);
  const multicallProvider = yield* select(multicallProviderSelector);
  const selectedGovernor = yield* select(selectedGovernorSelector);

  const isGovAdmin = selectedGovernor === GOVERNANCE_OPTIONS.GOVERNER_ADMIN.id;

  const govSelector = isGovAdmin
    ? governorAdminSelector
    : governorOwnerSelector;

  const governor = yield* select(govSelector);

  try {
    if (
      !account ||
      !governor ||
      !staking ||
      !subgraphClient ||
      !multicallProvider
    ) {
      throw new Error('Wallet not connected');
    }

    const threshold = yield* call(governor.proposalThreshold);
    const votes = yield* call(staking.getCurrentVotes, account);

    if (threshold.gt(votes)) {
      throw new Error(
        `Your voting power must be at least ${threshold} to make a proposal`
      );
    }

    const { proposals } = yield* call(proposalsListQuery, subgraphClient, {
      contractAddress: governor.address,
    });

    const proposalsStates = yield* fetchProposalStates(
      proposals,
      governor,
      multicallProvider
    );

    const isCurrentProposal =
      proposalsStates.findIndex(
        (s) => s === ProposalState.Pending || s === ProposalState.Active
      ) >= 0;

    if (isCurrentProposal) {
      throw new Error(
        'Propsals Already Exist. You cannot Add another proposal at this time'
      );
    }

    yield* put(proposalsActions.eligibleForAddProposal());
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : 'You cannot add the proposal right now. Please try again later';

    yield* put(proposalsActions.notEligibleForAddProposal(msg));
  }
}

function* triggerFetch() {
  yield* put(proposalsActions.checkAddPropsal());
}

function* triggerUpdate() {
  yield* put(proposalsActions.checkAddPropsal());
}

export const watchAddProposals = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: proposalsActions.stopWatchingAddProposal.type,
});
