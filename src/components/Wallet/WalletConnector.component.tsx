import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import { wallets } from '../../config/wallets';

import { WalletDropdown } from './WalletDropdown/WalletDropdown';
import { SelectedWallet } from './SelectedWallet/SelectedWallet.component';

const isProperWallet = (
  connectedWallet: number | undefined
): connectedWallet is number => !Number.isNaN(connectedWallet);

export const WalletConnector = () => {
  const [connectedWallet, setConnectedWallet] = useState<number>();
  const { active, account, deactivate } = useWeb3React();

  const onDissconnect = () => {
    deactivate();
    setConnectedWallet(undefined);
  };

  if (active && account && isProperWallet(connectedWallet)) {
    const wallet = wallets[connectedWallet];

    if (wallet) {
      return (
        <SelectedWallet
          wallet={wallet}
          onDissconnect={onDissconnect}
          account={account}
        />
      );
    }
  }

  return (
    <WalletDropdown wallets={wallets} setConnectedWallet={setConnectedWallet} />
  );
};
