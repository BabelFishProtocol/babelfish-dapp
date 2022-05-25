import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { ChainEnum } from '../../config/chains';

import {
  supportedChainsInCurrentNetworkSelector,
  walletNotConectedModalSelector,
  wrongNetworkModalSelector,
} from '../../store/app/app.selectors';
import { appActions } from '../../store/app/app.slice';
import { switchConnectedChain } from '../../utils/switchConnectedChain';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { WalletConnectionCheckerProps } from './WalletConnectionChecker.types';
import alarmIcon from '../../assets/icons/alarmIcon.svg';

export const WalletNotConnectedModal = () => {
  const dispatch = useDispatch();
  const walletNotConectedModal = useSelector(walletNotConectedModalSelector);

  const onClose = () => {
    dispatch(appActions.setWalletNotConnectedNetworkModal(false));
  };

  return (
    <AppDialog
      isOpenDialog={walletNotConectedModal}
      onClose={onClose}
      title="Wallet not connected"
      dialogPaperProps={{ sx: { minHeight: 'unset' } }}
    >
      Please connect your browser wallet.
    </AppDialog>
  );
};

export const WrongNetworkModal = () => {
  const dispatch = useDispatch();
  const wrongNetworkModal = useSelector(wrongNetworkModalSelector);
  const supportedChainsInCurrentNetwork = useSelector(
    supportedChainsInCurrentNetworkSelector
  );

  const onNetworkClick = (network: ChainEnum) => {
    switchConnectedChain(network);
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
      dialogPaperProps={{ sx: { minHeight: 'unset' } }}
    >
      <Typography variant="subtitle1">
        Please connect your browser wallet to a supported network from the list
        below:
      </Typography>
      <br />
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
