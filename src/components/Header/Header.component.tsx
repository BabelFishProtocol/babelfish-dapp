import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Logo } from '../Logo/Logo.component';
import dashboardIcon from '../../assets/icons/dashboard.svg';

export const Header = () => (
  <Box
    component="header"
    sx={{
      margin: '50px 66px 50px 100px',
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <Logo />
    <Box component="nav" sx={{ display: 'flex', alignItems: 'center' }}>
      <Button sx={{ padding: '15px 20px' }}>Connect Wallet</Button>
      <IconButton
        sx={{
          height: '100%',
          marginLeft: '20px',
          px: '15px',
          borderRadius: '8px',
        }}
      >
        <img alt="dashboard icon" src={dashboardIcon} />
      </IconButton>
    </Box>
  </Box>
);
