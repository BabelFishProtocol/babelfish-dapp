import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react';
import pendingIcon from '../../assets/icons/loading.svg';
import { VoteType } from '../../constants';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { VotingButtonProps } from './VotingButton.types';

export const VotingButton = ({
  type,
  sx,
  isLoading,
  onClick,
  isVoted,
  disabled,
}: VotingButtonProps) => {
  const [isVoting, setIsVoting] = useState(false);

  const isVoteFor = type === VoteType.FOR;

  const onButtonClick = () => {
    setIsVoting(true);
    if (onClick) {
      onClick();
    }
  };

  return (
    <Box>
      <AppDialog
        isOpenDialog={isVoting}
        title="Confirm Vote"
        icon={pendingIcon}
        description="The voting is in progress. Please approve the transaction from the wallet if prompted."
        onClose={() => {
          setIsVoting(false);
        }}
      >
        <Button
          onClick={() => {
            setIsVoting(false);
          }}
        >
          OK
        </Button>
      </AppDialog>

      <Button
        color={isVoteFor ? 'success' : 'error'}
        variant="outlined"
        disabled={disabled || isLoading || isVoting}
        sx={({ palette }) => ({
          boxShadow: `inset 0 0 0 2px ${
            isVoteFor ? palette.success.main : palette.error.main
          }`,
          backgroundColor: isVoteFor
            ? 'rgba(50, 240, 95, 0.1)'
            : 'rgba(239, 5, 18, 0.1)',
          ':hover': {
            backgroundColor: isVoteFor
              ? `rgba(50, 240, 95, 0.2)`
              : `rgba(239, 5, 18, 0.2)`,
          },
          ...sx,
        })}
        onClick={onButtonClick}
      >
        {!isVoted && (isLoading || isVoting) && (
          <>
            <CircularProgress
              color={isVoteFor ? 'success' : 'error'}
              size={20}
              sx={{ mr: 1 }}
            />
            Voting
          </>
        )}

        {!isVoted &&
          !isLoading &&
          !isVoting &&
          (isVoteFor ? 'Vote For' : 'Vote Against')}
        {isVoted && <>Voted &#10003;</>}
      </Button>
    </Box>
  );
};
