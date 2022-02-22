import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { MintingInfoPros } from './MintingInfo.types';

export const MintingInfo = ({ data }: MintingInfoPros) => (
  <>
    {data.map((d, i) => (
      <Box
        key={i}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
          my: '5px',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'right',
          }}
        >
          {d.label} :
        </Typography>
        <Typography
          sx={({ palette }) => ({
            textAlign: 'left',
            color: d.isProminant ? palette.primary.main : 'white',
          })}
          variant="body1"
        >
          {d.value}
        </Typography>
      </Box>
    ))}
  </>
);
