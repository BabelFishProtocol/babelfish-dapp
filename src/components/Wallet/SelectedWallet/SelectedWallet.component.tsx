import Box from '@mui/material/Box';

import { useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import Menu from '@mui/material/Menu';
import { Button } from '../../Button/Button.component';
import { PrettyTx } from '../../PrettyTx/PrettyTx.component';
import { WalletIcon } from '../WalletIcon/WalletIcon.component';
import crossIcon from '../../../assets/icons/cross.svg';

import { SelectedWalletProps } from './SelectedWallet.types';
import { WalletOption } from '../WalletOption/WalletOption.component';
import {
  connectorSelector,
  supportedNetworksSelector,
} from '../../../store/app/app.selectors';
import { ChainEnum, chains } from '../../../config/chains';
import { switchConnectedChain } from '../../../utils/switchConnectedChain';
import { isPortis } from '../../../utils/types';

export const SelectedWallet = ({
  account,
  wallet,
  onDisconnect,
}: SelectedWalletProps) => {
  const supportedNetworks = useSelector(supportedNetworksSelector);
  const connector = useSelector(connectorSelector);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onNetworkClick = async (networkId: ChainEnum) => {
    switchConnectedChain({ chain: networkId, connector });
    handleClose();
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          borderRadius: '8px',
          border: ({ palette }) => `2px solid ${palette.borderGrey.main}`,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            padding: ({ spacing }) => spacing(1.2, 2),
            pr: 1,
            gap: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {connector &&
            isPortis(connector) &&
            process.env.NODE_ENV !== 'production' && (
              <Button
                variant="text"
                onClick={handleClick}
                id="network-selector-button"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                aria-controls={open ? 'network-selector-menu' : undefined}
              >
                Change Network
              </Button>
            )}
          <PrettyTx
            value={account.toUpperCase()}
            color="inherit"
            variant="body1"
          />
          <WalletIcon name={wallet.name} icon={wallet.icon} />
        </Box>
        <Button
          variant="text"
          onClick={onDisconnect}
          sx={{
            p: 1,
            minWidth: 0,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor: 'borderGrey.dark',
          }}
        >
          <img
            style={{
              width: '15px',
              height: '15px',
            }}
            src={crossIcon}
            alt="Close"
          />
        </Button>
      </Box>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        id="network-selector-menu"
        aria-labelledby="network-selector-button"
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
        {supportedNetworks.map((network, index) => (
          <WalletOption
            autoFocus={index === 0}
            key={index}
            index={chains[supportedNetworks[index]].id}
            name={chains[supportedNetworks[index]].name}
            handleClick={onNetworkClick}
          />
        ))}
      </Menu>
    </>
  );
};
