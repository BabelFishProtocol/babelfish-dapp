import { select, call, put } from 'typed-redux-saga';
import { SagaContractCallStep } from '../../types';
import { contractStepCallsSaga } from '../../utils/utils.sagas';
import {
  selectedProposalGovernor,
  selectedProposalIdSelector,
} from '../proposals.selectors';
import { VoteCall } from '../proposals.state';
import { proposalsActions, ProposalsActions } from '../proposals.slice';

export function* castVote({ payload }: ProposalsActions['castVote']) {
  const proposalId = yield* select(selectedProposalIdSelector);
  const governorContract = yield* select(selectedProposalGovernor);

  if (!proposalId || !governorContract) {
    yield* put(proposalsActions.setVoteCallError('Proposal not selected'));
    return;
  }

  const voteType: VoteCall = payload.support ? 'vote for' : 'vote against';

  const voteStep: SagaContractCallStep<VoteCall> = {
    name: voteType,
    effect: call(governorContract.castVote, proposalId, payload.support),
  };

  yield* put(proposalsActions.setVoteCallSteps([voteStep]));

  yield* contractStepCallsSaga({
    steps: [voteStep],
    setErrorAction: proposalsActions.setVoteCallError,
    setStatusAction: proposalsActions.setVoteCallStatus,
    setStepDataAction: proposalsActions.setVoteCallStepData,
  });
}
