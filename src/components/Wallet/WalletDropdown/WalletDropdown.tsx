import { useCallback, useState } from 'react';
import { ConnectorUpdate } from '@web3-react/types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { UnsupportedChainIdError } from '@web3-react/core';

import { Button } from '../../Button/Button.component';
import { WalletIcon } from '../WalletIcon/WalletIcon.component';
import { WalletDropdownProps, WalletOptionProps } from './WalletDropdown.types';

export const WalletDropdown = ({
  wallets,
  activate,
  setConnectedWallet,
}: WalletDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const tryActivation = async (walletId: number) => {
    const { name, connector, icon, checkConnection } = wallets[walletId];

    checkConnection();

    // const portis = new Portis('bcc11290-a380-4a00-96b2-ca2803da406e', '31');
    // const web3 = new Web3(portis.provider);
    if (connector) {
      // if (name === 'Portis') {
      //   connector.;
      // }
      try {
        console.log(name, connector);

        const test = await activate(
          connector,
          (e) => {
            console.log('error?', e);
          },
          true
        );
        // const test = await activate(connector);
        console.log('activate', test);
        setConnectedWallet(name);
      } catch (e) {
        console.log('activate error', e);
        if (e instanceof UnsupportedChainIdError) {
          await activate(connector);
          setConnectedWallet(name);
        }
      }
    }
  };

  return (
    <>
      <Button
        sx={{ padding: ({ spacing }) => spacing(2, 2.5) }}
        id="wallet-selector-button"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'wallet-selector-menu' : undefined}
        onClick={handleClick}
      >
        Connect Wallet
      </Button>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        id="wallet-selector-menu"
        aria-labelledby="wallet-selector-button"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 2,
            mt: 2,
            borderRadius: '8px',
            backgroundImage: ({ palette }) => palette.boxGradient,
          },
          square: false,
        }}
        MenuListProps={{
          sx: { backgroundColor: 'initial' },
        }}
      >
        {wallets.map((wallet, index) => (
          <WalletOption
            key={index}
            walletIndex={index}
            name={wallet.name}
            icon={wallet.icon}
            tryActivation={tryActivation}
          />
        ))}
        <MenuItem
          sx={{
            p: 0,
            display: 'flex',
            justifyContent: 'center',
            ':hover': { backgroundColor: 'inherit' },
          }}
        >
          <Button
            size="small"
            variant="text"
            sx={{ textTransform: 'unset', p: 0, textAlign: 'center' }}
          >
            <Typography>What Is a wallet?</Typography>
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};

const WalletOption = ({
  name,
  icon,
  walletIndex,
  tryActivation,
}: WalletOptionProps) => (
  <MenuItem
    autoFocus={walletIndex === 0}
    onClick={() => {
      tryActivation(walletIndex);
    }}
    sx={{
      width: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 2,
      px: 2,
      py: 1,
      borderRadius: '6px',
      border: 'solid 2px rgba(0, 0, 0, 0.4)',
      backgroundColor: ({ palette }) => alpha(palette.common.white, 0.08),
    }}
  >
    <Typography>{name}</Typography>
    <WalletIcon
      icon={icon}
      name={name}
      sx={{ backgroundColor: 'common.white' }}
    />
  </MenuItem>
);
