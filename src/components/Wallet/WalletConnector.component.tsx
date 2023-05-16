import { useDispatch, useSelector } from 'react-redux';
import { wallets } from '../../config/wallets';
import { useUnsupportedChainIdError } from '../../hooks/useUnsupportedChainIdError';

import { WalletDropdown } from './WalletDropdown/WalletDropdown';
import { SelectedWallet } from './SelectedWallet/SelectedWallet.component';
import { connectedWalletSelector } from '../../store/app/app.selectors';
import { appActions } from '../../store/app/app.slice';
import { WrongNetwork } from './WrongNetwork/WrongNetwork.component';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import { useAccount } from '../../hooks/useAccount';

export const WalletConnector = () => {
  const dispatch = useDispatch();

  const connectedWallet = useSelector(connectedWalletSelector);

  const { connectWallet, disconnectWallet, pending } = useWalletConnect();

  const { account } = useAccount();

  const unsupportedChainIdError = useUnsupportedChainIdError();

  const onDisconnect = () => {
    disconnectWallet();
    dispatch(appActions.walletDisconnected());
  };

  const wallet = wallets.find(
    (item) => item.name.toLowerCase() === connectedWallet?.toLowerCase()
  );

  if (unsupportedChainIdError) {
    return <WrongNetwork />;
  }

  if (!pending && account && wallet) {
    return (
      <SelectedWallet
        wallet={wallet}
        onDisconnect={onDisconnect}
        account={account}
      />
    );
  }

  return <WalletDropdown wallets={wallets} activate={connectWallet} />;
};
