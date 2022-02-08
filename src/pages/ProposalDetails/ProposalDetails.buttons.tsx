import { Button } from '../../components/Button/Button.component';
import { VoteButtonProps } from './ProposalDetails.types';

const VotedText = () => <>voted &#10003;</>;

export const VoteForButton = ({ voteStatus }: VoteButtonProps) => {
  const { status, type } = voteStatus;
  return (
    <Button
      color="success"
      variant="outlined"
      loadingText="Voting..."
      disabled={status !== 'idle'}
      isLoading={type === 'for' && status === 'loading'}
      sx={({ palette }) => ({
        boxShadow: `inset 0 0 0 2px ${palette.success.main}`,
        backgroundColor: 'rgba(50, 240, 95, 0.1)',
        ':hover': {
          backgroundColor: `rgba(50, 240, 95, 0.2)`,
        },
      })}
    >
      {type === 'for' && status === 'success' ? <VotedText /> : 'Vote For This'}
    </Button>
  );
};

export const VoteAgainstButton = ({ voteStatus }: VoteButtonProps) => {
  const { status, type } = voteStatus;
  return (
    <Button
      color="error"
      variant="outlined"
      loadingText="Voting..."
      isLoading={type === 'against' && status === 'loading'}
      disabled={status !== 'idle'}
      sx={({ palette }) => ({
        boxShadow: `inset 0 0 0 2px ${palette.error.main}`,
        backgroundColor: `rgba(239, 5, 18, 0.1)`,
        ':hover': {
          backgroundColor: `rgba(239, 5, 18, 0.2)`,
        },
      })}
    >
      {type === 'against' && status === 'success' ? (
        <VotedText />
      ) : (
        'Vote Against'
      )}
    </Button>
  );
};
