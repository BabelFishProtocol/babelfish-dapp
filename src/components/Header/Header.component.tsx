import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Logo } from '../Logo/Logo.component';
import dashboardIcon from '../../assets/icons/dashboard.svg';

export const Header: React.FC = () => (
  <Box
    component="header"
    sx={{
      margin: ({ spacing }) => spacing(7, 8, 7, 12),
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <Logo />
    <Box component="nav" sx={{ display: 'flex', alignItems: 'center' }}>
      <Button sx={{ padding: ({ spacing }) => spacing(2, 2.5) }}>
        Connect Wallet
      </Button>
      <IconButton
        sx={({ spacing }) => ({
          height: '100%',
          marginLeft: spacing(2.5),
          px: spacing(2),
          borderRadius: '8px',
        })}
      >
        <img alt="dashboard icon" src={dashboardIcon} />
      </IconButton>
    </Box>
  </Box>
);
