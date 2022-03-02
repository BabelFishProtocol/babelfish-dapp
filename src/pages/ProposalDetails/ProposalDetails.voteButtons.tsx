import { useState } from 'react';
import { Button } from '../../components/Button/Button.component';
import { VotingDialog } from '../../components/VotingDialog/VotingDialog.component';
import { ProposalState } from '../../constants';
import { VoteButtonProps } from './ProposalDetails.types';

const VotedText = () => <>voted &#10003;</>;

export const VoteForButton = ({
  voteStatus,
  proposalState,
}: VoteButtonProps) => {
  const { status, type } = voteStatus;

  const votedFor = type === 'for' && status === 'success';
  const showButton = proposalState === ProposalState.Active || votedFor;
  const [showDialog, setShowDialog] = useState(false);

  if (!showButton) {
    return null;
  }

  return (
    <>
      <VotingDialog
        isOpenDialog={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      />
      <Button
        color="success"
        variant="outlined"
        loadingText="Voting..."
        disabled={status !== 'idle'}
        onClick={() => {
          setShowDialog(true);
        }}
        isLoading={type === 'for' && status === 'loading'}
        sx={({ palette }) => ({
          boxShadow: `inset 0 0 0 2px ${palette.success.main}`,
          backgroundColor: 'rgba(50, 240, 95, 0.1)',
          ':hover': {
            backgroundColor: `rgba(50, 240, 95, 0.2)`,
          },
        })}
      >
        {votedFor ? <VotedText /> : 'Vote For This'}
      </Button>
    </>
  );
};

export const VoteAgainstButton = ({
  voteStatus,
  proposalState,
}: VoteButtonProps) => {
  const { status, type } = voteStatus;

  const votedAgainst = type === 'against' && status === 'success';
  const showButton = proposalState === ProposalState.Active || votedAgainst;
  const [showDialog, setShowDialog] = useState(false);

  if (!showButton) {
    return null;
  }

  return (
    <>
      <VotingDialog
        isOpenDialog={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      />
      <Button
        color="error"
        variant="outlined"
        loadingText="Voting..."
        isLoading={type === 'against' && status === 'loading'}
        disabled={status !== 'idle'}
        onClick={() => {
          setShowDialog(true);
        }}
        sx={({ palette }) => ({
          boxShadow: `inset 0 0 0 2px ${palette.error.main}`,
          backgroundColor: `rgba(239, 5, 18, 0.1)`,
          ':hover': {
            backgroundColor: `rgba(239, 5, 18, 0.2)`,
          },
        })}
      >
        {votedAgainst ? <VotedText /> : 'Vote Against'}
      </Button>
    </>
  );
};
