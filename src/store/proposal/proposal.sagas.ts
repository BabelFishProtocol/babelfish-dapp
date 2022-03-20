import { PayloadAction } from '@reduxjs/toolkit';
import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import { all, call, put, select, takeLatest } from 'typed-redux-saga';
import { GOVERNANCE_OPTIONS } from '../../constants';
import { AddProposalInputs } from '../../pages/AddProposal/AddProposal.fields';
import { AddProposalFields } from '../../pages/AddProposal/AddProposal.types';
import {
  accountSelector,
  governerAdminSelector,
  governerOwnerSelector,
  stakingContractSelector,
} from '../app/app.selectors';
import { proposalActions } from './proposal.slice';

export function* fetchThreshold({ payload }: PayloadAction<AddProposalFields>) {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);
    const isGovAdmin =
      payload[AddProposalInputs.SendProposalContract] ===
      GOVERNANCE_OPTIONS.GOVERNER_ADMIN.id;

    const govSelector = isGovAdmin
      ? governerAdminSelector
      : governerOwnerSelector;

    const governor = yield* select(govSelector);

    if (!account || !governor || !staking) {
      throw new Error('Wallet not connected');
    }

    const threshold = yield* call(governor.proposalThreshold);
    const votes = yield* call(staking.getCurrentVotes, account);

    if (threshold > BigNumber.from(votes)) {
      const errorMsg = `Your voting power must be at least ${threshold.toString()} to make a proposal`;
      yield* put(proposalActions.porposalFailure(errorMsg));
      return;
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

    yield* call(
      governor.propose,
      targets,
      values,
      signatures,
      calldatas,
      description,
      { from: account }
    );
    yield* put(proposalActions.proposalSuccess);
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : 'There was some error in Adding the proposal. Please try again';

    yield* put(proposalActions.porposalFailure(msg));
  }
}

export function* propsalSaga() {
  yield* all([takeLatest(proposalActions.startProposal, fetchThreshold)]);
}
