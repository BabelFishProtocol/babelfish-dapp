import { BigNumberish, BytesLike } from 'ethers';
import { all, put, call, select, takeLatest } from 'typed-redux-saga';
import {
  fetchProposalDetails,
  watchProposalDetails,
} from './sagas/proposalDetails';
import { ProposalsActions, proposalsActions } from './proposals.slice';
import { fetchProposalsList, watchProposalsList } from './sagas/proposalList';

import {
  governorAdminSelector,
  governorOwnerSelector,
  accountSelector,
  stakingContractSelector,
} from '../app/app.selectors';

import { AddProposalInputs } from '../../pages/AddProposal/AddProposal.fields';
import { GOVERNANCE_OPTIONS } from '../../constants';

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
    takeLatest(proposalsActions.fetchDetails.type, fetchProposalDetails),
    takeLatest(proposalsActions.updateDetails.type, fetchProposalDetails),
    takeLatest(proposalsActions.watchDetails.type, watchProposalDetails),

    takeLatest(proposalsActions.fetchProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.updateProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.watchProposalsList.type, watchProposalsList),
    takeLatest(proposalsActions.startProposal, addProposal),
  ]);
}
