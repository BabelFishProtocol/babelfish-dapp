import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react';
import pendingIcon from '../../assets/icons/loading.svg';
import { VoteType } from '../../constants';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { VotingButtonProps } from './VotingButton.types';

export const VotingButton = ({ type, sx, onClick }: VotingButtonProps) => {
  const [isVoting, setIsVoting] = useState(false);

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

      {type === VoteType.FOR && (
        <Button
          color="success"
          variant="outlined"
          sx={({ palette }) => ({
            boxShadow: `inset 0 0 0 2px ${palette.success.main}`,
            backgroundColor: 'rgba(50, 240, 95, 0.1)',
            ':hover': {
              backgroundColor: `rgba(50, 240, 95, 0.2)`,
            },
            ...sx,
          })}
          onClick={onButtonClick}
        >
          {isVoting && (
            <>
              <CircularProgress color="success" size={20} sx={{ mr: 1 }} />
              Voting
            </>
          )}

          {!isVoting && <>Vote For</>}
        </Button>
      )}
      {type === VoteType.AGAINST && (
        <Button
          color="error"
          variant="outlined"
          sx={({ palette }) => ({
            boxShadow: `inset 0 0 0 2px ${palette.error.main}`,
            backgroundColor: `rgba(239, 5, 18, 0.1)`,
            ':hover': {
              backgroundColor: `rgba(239, 5, 18, 0.2)`,
            },
            ...sx,
          })}
          onClick={onButtonClick}
        >
          {isVoting && (
            <>
              <CircularProgress color="error" size={20} sx={{ mr: 1 }} />
              Voting
            </>
          )}

          {!isVoting && <>Vote Against</>}
        </Button>
      )}
    </Box>
  );
};
