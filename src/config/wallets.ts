import { AbstractConnector } from '@web3-react/abstract-connector';
import { injectedProvider } from './providers';

import metamaskIcon from '../assets/icons/metamask-icon.webp';
import portisIcon from '../assets/icons/portis.svg';
import niftyIcon from '../assets/icons/nifty.png';
import liqualityIcon from '../assets/icons/liquality.png';
import { WindowWithEthereum } from '../utils/types';

const ethereum = (window as WindowWithEthereum)?.ethereum;

export type SupportedWallets = 'Metamask' | 'Nifty' | 'Liquality' | 'Portis';

export type WalletConfig = {
  name: SupportedWallets;
  icon: string;
  connector: AbstractConnector;
  checkConnection: () => void;
};

export const wallets: WalletConfig[] = [
  {
    name: 'Metamask',
    icon: metamaskIcon,
    connector: injectedProvider,
    checkConnection: () => {
      if (!ethereum || !ethereum.isMetaMask) {
        throw new Error(
          '🦊 You must install Metamask into your browser: https://metamask.io/download.html and make sure it is set as the default wallet.'
        );
      }
    },
  },
  {
    name: 'Nifty',
    icon: niftyIcon,
    connector: injectedProvider,
    checkConnection: () => {
      if (!ethereum || !ethereum.isNiftyWallet) {
        throw new Error(
          '👛 You must install Nifty into your browser: https://bit.ly/3k1lBqP and make sure it is set as the default wallet.'
        );
      }
    },
  },
  {
    name: 'Liquality',
    icon: liqualityIcon,
    connector: injectedProvider,
    checkConnection: () => {
      if (!ethereum || !ethereum.isLiquality) {
        throw new Error(
          '🔵🟣 You must install Liquality into your browser: https://liquality.io/wallet.html and make sure it is set as the default wallet.'
        );
      }
    },
  },
  {
    name: 'Portis',
    icon: portisIcon,
    // connector: providerProvider, // TODO: fix portis errors
    connector: injectedProvider,
    checkConnection: () => {},
  },
];
