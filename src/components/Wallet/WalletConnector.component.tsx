import { useDispatch, useSelector } from 'react-redux';
import { WalletEnum, wallets } from '../../config/wallets';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useUnsupportedChainIdError } from '../../hooks/useUnsupportedChainIdError';

import { WalletDropdown } from './WalletDropdown/WalletDropdown';
import { SelectedWallet } from './SelectedWallet/SelectedWallet.component';
import { connectedWalletSelector } from '../../store/app/app.selectors';
import { appActions } from '../../store/app/app.slice';
import { WrongNetwork } from './WrongNetwork/WrongNetwork.component';

export const WalletConnector = () => {
  const dispatch = useDispatch();
  const connectedWallet = useSelector(connectedWalletSelector);
  const { active, account, deactivate, activate } = useActiveWeb3React();
  const unsupportedChainIdError = useUnsupportedChainIdError();

  const setConnectedWallet = (wallet: WalletEnum) => {
    dispatch(appActions.setConnectedWallet(wallet));
  };

  const onDisconnect = () => {
    deactivate();
    dispatch(appActions.walletDisconnected());
  };

  const wallet = wallets.find((item) => item.name === connectedWallet);

  if (unsupportedChainIdError) {
    return <WrongNetwork />;
  }

  if (active && account && wallet) {
    return (
      <SelectedWallet
        wallet={wallet}
        onDisconnect={onDisconnect}
        account={account}
      />
    );
  }

  return (
    <WalletDropdown
      wallets={wallets}
      activate={activate}
      setConnectedWallet={setConnectedWallet}
    />
  );
};
