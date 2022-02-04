import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';

export const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {/* CONTEMPORARY LOGO ICON (YELLOW CIRCLE) */}
    <Box
      sx={(theme) => ({
        height: 40,
        width: 40,
        backgroundColor: theme.palette.primary.main,
        borderRadius: '50%',
        display: 'inline-block',
      })}
    />
    <Typography variant="h1" sx={{ marginLeft: '14px' }}>
      BABELFISH.MONEY
    </Typography>
  </Box>
);
