import { Typography } from '@mui/material';
import { Button } from '../../../components/Button/Button.component';
import { ProposalState } from '../../../constants';
import { VoteButtonProps } from './VotesBlock.types';
import thumbUpIcon from '../../../assets/icons/thumb-up.svg';
import thumbDownIcon from '../../../assets/icons/thumb-down.svg';

const VotedText = () => <>voted &#10003;</>;

export const VoteButton = ({
  type,
  voteStatus,
  proposalState,
  handleCastVote,
}: VoteButtonProps) => {
  const { status, type: voteResult } = voteStatus;

  if (type === 'for') {
    const votedFor = voteResult === 'for';
    const showButton = proposalState === ProposalState.Active || votedFor;

    if (!showButton) {
      return null;
    }

    return (
      <Button
        sx={{ flexGrow: 1 }}
        color="success"
        variant="outlined"
        loadingText="Voting..."
        disabled={status !== 'idle' || !!voteResult}
        onClick={handleCastVote}
        isLoading={status === 'loading'}
        startIcon={<img src={thumbUpIcon} height={18} alt="vote for" />}
      >
        <Typography variant="button">
          {votedFor ? <VotedText /> : 'Vote For This'}
        </Typography>
      </Button>
    );
  }

  const votedAgainst = voteResult === 'against';
  const showButton = proposalState === ProposalState.Active || votedAgainst;

  if (!showButton) {
    return null;
  }

  return (
    <Button
      sx={{ flexGrow: 1 }}
      color="error"
      variant="outlined"
      loadingText="Voting..."
      isLoading={status === 'loading'}
      disabled={status !== 'idle' || !!voteResult}
      onClick={handleCastVote}
      startIcon={<img src={thumbDownIcon} height={18} alt="vote against" />}
    >
      <Typography variant="button">
        {votedAgainst ? <VotedText /> : 'Vote Against'}
      </Typography>
    </Button>
  );
};
