import { useCallback, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { UnsupportedChainIdError } from '@web3-react/core';

import { useDispatch } from 'react-redux';
import { Button } from '../../Button/Button.component';
import { WalletDropdownProps } from './WalletDropdown.types';
import { appActions } from '../../../store/app/app.slice';
import { WalletOption } from '../WalletOption/WalletOption.component';

export const WalletDropdown = ({
  wallets,
  activate,
  setConnectedWallet,
}: WalletDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const tryActivation = async (id: number) => {
    const { name, connector, checkConnection } = wallets[id];

    checkConnection();

    if (connector) {
      try {
        await activate(connector);

        setConnectedWallet(name);
        dispatch(appActions.setConnector(connector));
      } catch (e) {
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
            index={index}
            name={wallet.name}
            icon={wallet.icon}
            handleClick={tryActivation}
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
