import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';

import {
  supportedNetworksNamesSelector,
  walletNotConectedModalSelector,
  wrongNetworkModalSelector,
} from '../../store/app/app.selectors';
import { appActions } from '../../store/app/app.slice';
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
      dialogPaperProps={{ sx: { minHeight: 0 } }}
    >
      Please connect your browser wallet.
    </AppDialog>
  );
};

export const WrongNetworkModal = () => {
  const dispatch = useDispatch();
  const wrongNetworkModal = useSelector(wrongNetworkModalSelector);
  const supportedNetworksNames = useSelector(supportedNetworksNamesSelector);

  const onClose = () => {
    dispatch(appActions.setWrongNetworkModal(false));
  };

  return (
    <AppDialog
      isOpenDialog={wrongNetworkModal}
      onClose={onClose}
      title="Wrong network"
      dialogPaperProps={{ sx: { minHeight: 0 } }}
    >
      Please connect your browser wallet to a supported network.
      <br />
      <Typography variant="subtitle2">
        Supported networks: {supportedNetworksNames.join(', ')}
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
