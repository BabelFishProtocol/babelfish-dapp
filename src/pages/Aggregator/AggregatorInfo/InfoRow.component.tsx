import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import React from 'react';
import { FiniteStates } from '../../../utils/types';

type InfoRowProps = {
  label: string;
  value?: string;
  state: FiniteStates;
};

export const InfoRow = ({ label, value, state }: InfoRowProps) => {
  const isUpdate = !value || state === 'loading';
  return (
    <>
      <Typography
        sx={{
          textAlign: 'right',
          fontWeight: 600,
          fontSize: 12,
        }}
      >
        {label}:
      </Typography>
      <Box sx={{ minWidth: '16ch' }}>
        {isUpdate ? (
          <Skeleton sx={{ height: '1em', width: '100%' }} />
        ) : (
          <Typography
            sx={{
              textAlign: 'left',
              fontSize: 12,
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </>
  );
};
