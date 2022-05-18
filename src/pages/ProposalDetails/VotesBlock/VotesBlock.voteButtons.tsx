import { Button } from '../../../components/Button/Button.component';
import { ProposalState } from '../../../constants';
import { VoteButtonProps } from './VotesBlock.types';

const VotedText = () => <>voted &#10003;</>;

export const VoteForButton = ({
  voteStatus,
  proposalState,
  handleCastVote,
}: VoteButtonProps) => {
  const { status, type } = voteStatus;

  const votedFor = type === 'for';
  const showButton = proposalState === ProposalState.Active || votedFor;

  if (!showButton) {
    return null;
  }

  return (
    <Button
      color="success"
      variant="outlined"
      loadingText="Voting..."
      disabled={status !== 'idle' || !!type}
      onClick={handleCastVote}
      isLoading={status === 'loading'}
    >
      {votedFor ? <VotedText /> : 'Vote For This'}
    </Button>
  );
};

export const VoteAgainstButton = ({
  voteStatus,
  proposalState,
  handleCastVote,
}: VoteButtonProps) => {
  const { status, type } = voteStatus;

  const votedAgainst = type === 'against';
  const showButton = proposalState === ProposalState.Active || votedAgainst;

  if (!showButton) {
    return null;
  }

  return (
    <Button
      color="error"
      variant="outlined"
      loadingText="Voting..."
      isLoading={status === 'loading'}
      disabled={status !== 'idle' || !!type}
      onClick={handleCastVote}
    >
      {votedAgainst ? <VotedText /> : 'Vote Against'}
    </Button>
  );
};
