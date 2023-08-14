import React, { ReactNode, useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { onboard } from '../lib/connector';

const AUTOCONNECT_WALLET_LABEL = 'autoconnect-sovryn-wallet-label';

type NetworkProviderProps = {
  children: ReactNode;
};

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
}) => {
  useEffect(() => {
    const walletSubscription = onboard.state
      .select('wallets')
      .subscribe((wallets) => {
        if (wallets.length > 0) {
          const { label } = wallets[0];
          reactLocalStorage.set(AUTOCONNECT_WALLET_LABEL, label);
        } else {
          reactLocalStorage.remove(AUTOCONNECT_WALLET_LABEL);
        }
      });

    const selected = reactLocalStorage.get<string>(AUTOCONNECT_WALLET_LABEL);
    if (selected) {
      onboard.connectWallet(selected);
    }

    return () => {
      walletSubscription.unsubscribe();
    };
  }, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
