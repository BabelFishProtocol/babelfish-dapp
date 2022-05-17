import { BigNumberish, BytesLike } from 'ethers';
import { put, call, select } from 'typed-redux-saga';

import { GOVERNANCE_OPTIONS, ProposalState } from '../../../constants';
import { AddProposalInputs } from '../../../pages/AddProposal/AddProposal.fields';
import { userProposalsListQuery } from '../../../queries/proposalListQuery';
import { formatWeiAmount } from '../../../utils/helpers';

import {
  governorAdminSelector,
  governorOwnerSelector,
  accountSelector,
  stakingContractSelector,
  subgraphClientSelector,
  multicallProviderSelector,
} from '../../app/app.selectors';
import { SagaContractCallStep } from '../../types';
import {
  contractStepCallsSaga,
  createWatcherSaga,
} from '../../utils/utils.sagas';
import { selectedGovernorSelector } from '../proposals.selectors';
import { ProposalsActions, proposalsActions } from '../proposals.slice';
import { AddProposalCalls } from '../proposals.state';
import { fetchProposalStates } from './utils';

export function* getGovernor(isGovAdmin: boolean) {
  const govSelector = isGovAdmin
    ? governorAdminSelector
    : governorOwnerSelector;

  return yield* select(govSelector);
}

export function* addProposal({ payload }: ProposalsActions['addProposal']) {
  const account = yield* select(accountSelector);
  const isGovAdmin =
    payload[AddProposalInputs.SendProposalContract] ===
    GOVERNANCE_OPTIONS.GOVERNOR_ADMIN.id;

  const governor = yield* getGovernor(isGovAdmin);

  if (!account || !governor) {
    yield* put(proposalsActions.setAddProposalError('Wallet not connected'));
    return;
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

  const addProposalStep: SagaContractCallStep<AddProposalCalls> = {
    name: 'propose',
    effect: call(
      governor.propose,
      targets,
      values,
      signatures,
      calldatas,
      description
    ),
  };

  yield* contractStepCallsSaga<AddProposalCalls>({
    steps: [addProposalStep],
    setErrorAction: proposalsActions.setAddProposalError,
    setStatusAction: proposalsActions.setAddProposalStatus,
    setStepDataAction: proposalsActions.setAddProposalStepData,
  });
}

export function* checkAddEligibility() {
  const account = yield* select(accountSelector);
  const staking = yield* select(stakingContractSelector);
  const subgraphClient = yield* select(subgraphClientSelector);
  const multiCallProvider = yield* select(multicallProviderSelector);
  const selectedGovernor = yield* select(selectedGovernorSelector);

  const isGovAdmin = selectedGovernor === GOVERNANCE_OPTIONS.GOVERNOR_ADMIN.id;

  const governor = yield* getGovernor(isGovAdmin);

  try {
    if (
      !account ||
      !governor ||
      !staking ||
      !subgraphClient ||
      !multiCallProvider
    ) {
      throw new Error('Wallet not connected');
    }

    const threshold = yield* call(governor.proposalThreshold);
    const votes = yield* call(staking.getCurrentVotes, account);

    if (threshold.gt(votes)) {
      throw new Error(
        `Your voting power must be at least ${formatWeiAmount(
          threshold
        )} to make a proposal`
      );
    }

    const { proposals } = yield* call(userProposalsListQuery, subgraphClient, {
      contractAddress: governor.address,
      proposerAddress: account,
    });

    const proposalsStates = yield* fetchProposalStates(
      proposals,
      governor,
      multiCallProvider
    );

    const isCurrentProposal = proposalsStates.some(
      (s) => s === ProposalState.Pending || s === ProposalState.Active
    );

    if (isCurrentProposal) {
      throw new Error(
        'You already have a live proposal. You cannot add another one at this time'
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
  yield* put(proposalsActions.checkEligibility());
}

export const watchEligibility = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerFetch,
  stopAction: proposalsActions.eligibleForAddProposal.type,
});
