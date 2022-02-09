import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Link } from 'react-router-dom';

import { Logo } from '../Logo/Logo.component';
import dashboardIcon from '../../assets/icons/dashboard.svg';

import { Urls } from '../../constants';

export const Header = () => (
  <>
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

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        m: 5,
      }}
    >
      {(Object.keys(Urls) as Array<keyof typeof Urls>).map((url) => (
        <Button component={Link} to={Urls[url]}>
          {url}
        </Button>
      ))}
    </Box>
  </>
);
