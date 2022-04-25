import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { ChainEnum, chains } from '../../config/chains';

import {
  supportedNetworksSelector,
  walletNotConectedModalSelector,
  wrongNetworkModalSelector,
} from '../../store/app/app.selectors';
import { appActions } from '../../store/app/app.slice';
import { switchConnectedChain } from '../../utils/switchConnectedChain';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { WalletConnectionCheckerProps } from './WalletConnectionChecker.types';

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
  const supportedNetworksNames = useSelector(supportedNetworksSelector);

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
      title="Wrong network"
      dialogPaperProps={{ sx: { minHeight: 'unset' } }}
    >
      Please connect your browser wallet to a supported network.
      <br />
      <Typography variant="subtitle2">
        Supported networks:{' '}
        {supportedNetworksNames.map((network) => (
          <Button
            key={network}
            size="small"
            variant="text"
            onClick={() => {
              onNetworkClick(network);
            }}
          >
            <Typography variant="body2">{chains[network].name}</Typography>
          </Button>
        ))}
      </Typography>
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
