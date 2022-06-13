import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { ChainEnum } from '../../config/chains';

import {
  connectorSelector,
  supportedChainsInCurrentNetworkSelector,
  walletNotConnectedModalSelector,
  wrongNetworkModalSelector,
} from '../../store/app/app.selectors';
import { appActions } from '../../store/app/app.slice';
import { switchConnectedChain } from '../../utils/switchConnectedChain';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { WalletConnectionCheckerProps } from './WalletConnectionChecker.types';
import alarmIcon from '../../assets/icons/alarmIcon.svg';

export const WalletNotConnectedModal = () => {
  const dispatch = useDispatch();
  const walletNotConnectedModal = useSelector(walletNotConnectedModalSelector);

  const onClose = () => {
    dispatch(appActions.setWalletNotConnectedNetworkModal(false));
  };

  return (
    <AppDialog
      isOpenDialog={walletNotConnectedModal}
      onClose={onClose}
      icon={alarmIcon}
      titleSx={{
        color: 'error.main',
      }}
      title="Wallet not connected"
      dialogPaperProps={{ sx: { minHeight: 'unset' } }}
      description="Please connect your browser wallet."
    />
  );
};

export const WrongNetworkModal = () => {
  const dispatch = useDispatch();
  const wrongNetworkModal = useSelector(wrongNetworkModalSelector);
  const connector = useSelector(connectorSelector);
  const supportedChainsInCurrentNetwork = useSelector(
    supportedChainsInCurrentNetworkSelector
  );

  const onNetworkClick = async (network: ChainEnum) => {
    switchConnectedChain({ chain: network, connector });
  };

  const onClose = () => {
    dispatch(appActions.setWrongNetworkModal(false));
  };

  return (
    <AppDialog
      isOpenDialog={wrongNetworkModal}
      onClose={onClose}
      icon={alarmIcon}
      title="Wrong network"
      titleSx={{
        color: 'error.main',
      }}
      dialogPaperProps={{ sx: { minHeight: 'unset' } }}
    >
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2.5 }}>
          Please connect your browser wallet to a supported network from the
          list below:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {supportedChainsInCurrentNetwork.map((network) => (
            <Button
              key={network.name}
              size="small"
              variant="text"
              onClick={() => {
                onNetworkClick(network.id);
              }}
            >
              <Typography variant="body2">{network.name}</Typography>
            </Button>
          ))}
        </Box>
      </Box>
    </AppDialog>
  );
};
export const WalletConnectionChecker = ({
  children,
}: WalletConnectionCheckerProps) => (
  <>
    <WalletNotConnectedModal />
    <WrongNetworkModal />

    {children}
  </>
);
