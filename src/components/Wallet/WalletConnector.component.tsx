import { useState } from 'react';

import { wallets } from '../../config/wallets';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';

import { WalletDropdown } from './WalletDropdown/WalletDropdown';
import { SelectedWallet } from './SelectedWallet/SelectedWallet.component';

const isProperWallet = (
  connectedWallet: number | undefined
): connectedWallet is number => !Number.isNaN(connectedWallet);

export const WalletConnector = () => {
  const [connectedWallet, setConnectedWallet] = useState<number>();
  const { active, account, deactivate, activate } = useActiveWeb3React();

  const onDisconnect = () => {
    deactivate();
    setConnectedWallet(undefined);
  };

  if (active && account && isProperWallet(connectedWallet)) {
    const wallet = wallets[connectedWallet];

    if (wallet) {
      return (
        <SelectedWallet
          wallet={wallet}
          onDisconnect={onDisconnect}
          account={account}
        />
      );
    }
  }

  return (
    <WalletDropdown
      wallets={wallets}
      activate={activate}
      setConnectedWallet={setConnectedWallet}
    />
  );
};
