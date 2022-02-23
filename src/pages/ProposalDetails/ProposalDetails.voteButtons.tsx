import { VotingButton } from '../../components/VotingButton/VotingButton.component';
import { ProposalState, VoteType } from '../../constants';
import { VoteButtonProps } from './ProposalDetails.types';

export const VoteForButton = ({
  voteStatus,
  proposalState,
}: VoteButtonProps) => {
  const { status, type } = voteStatus;

  const votedFor = type === 'for' && status === 'success';
  const showButton = proposalState === ProposalState.Active || votedFor;

  if (!showButton) {
    return null;
  }

  return (
    <VotingButton
      type={VoteType.FOR}
      isLoading={type === 'for' && status === 'loading'}
      isVoted={votedFor}
      disabled={status !== 'idle'}
    />
  );
};

export const VoteAgainstButton = ({
  voteStatus,
  proposalState,
}: VoteButtonProps) => {
  const { status, type } = voteStatus;

  const votedAgainst = type === 'against' && status === 'success';
  const showButton = proposalState === ProposalState.Active || votedAgainst;

  if (!showButton) {
    return null;
  }

  return (
    <VotingButton
      type={VoteType.AGAINST}
      isLoading={type === 'against' && status === 'loading'}
      isVoted={votedAgainst}
      disabled={status !== 'idle'}
    />
  );
};
