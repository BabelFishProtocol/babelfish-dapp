import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'typed-redux-saga';
import { GOVERNANCE_OPTIONS } from '../../constants';
import {
  accountSelector,
  governerAdminSelector,
  governerOwnerSelector,
} from '../app/app.selectors';
import { proposalActions } from './proposal.slice';
import { ProposalGovernorInput } from './proposal.state';

export function* fetchThreshold({
  payload,
}: PayloadAction<ProposalGovernorInput>) {
  try {
    const account = yield* select(accountSelector);
    const govSelector =
      payload.governorType === GOVERNANCE_OPTIONS.GOVERNER_ADMIN.id
        ? governerAdminSelector
        : governerOwnerSelector;

    const governor = yield* select(govSelector);

    if (!account || !governor) {
      throw new Error('Wallet not connected');
    }

    const threshold = yield* call(governor.proposalThreshold);

    yield* put(
      proposalActions.setThreshold({
        threshold,
      })
    );
  } catch (e) {
    yield* put(proposalActions.fetchThresholdFailure());
  }
}

export function* propsalSaga() {
  yield* all([takeLatest(proposalActions.startFetchThreshold, fetchThreshold)]);
}
