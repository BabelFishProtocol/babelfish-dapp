import Typography from '@mui/material/Typography';
import React from 'react';

type InfoRowProps = {
  label: string;
  value: string;
};

export const InfoRow = ({ label, value }: InfoRowProps) => (
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
    <Typography
      sx={{
        textAlign: 'left',
        fontSize: 12,
      }}
    >
      {value}
    </Typography>
  </>
);
