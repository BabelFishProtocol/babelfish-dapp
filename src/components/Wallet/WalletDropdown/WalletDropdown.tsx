import { useCallback, useState } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

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
    const { connector, checkConnection } = wallets[walletId];

    checkConnection();

    if (connector) {
      try {
        await activate(connector, undefined, true);
        setConnectedWallet(walletId);
      } catch (e) {
        // if (e instanceof UnsupportedChainIdError) {
        //   await activate(connector);
        //   setConnectedWallet(walletId);
        // } else {
        //   console.log('error', e);
        // }
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
        aria-controls={open ? 'demo-positioned-menu' : undefined}
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
            walletId={index}
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
  walletId,
  tryActivation,
}: WalletOptionProps) => (
  <MenuItem
    onClick={() => {
      tryActivation(walletId);
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
