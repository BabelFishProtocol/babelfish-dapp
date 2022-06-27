import { AbstractConnector } from '@web3-react/abstract-connector';
import { injectedConnector } from './providers';

import metamaskIcon from '../assets/icons/metamask-icon.webp';
// import portisIcon from '../assets/icons/portis.svg';
import niftyIcon from '../assets/icons/nifty.png';
import liqualityIcon from '../assets/icons/liquality.png';
import { WindowWithEthereum } from '../utils/types';

const ethereum = (window as WindowWithEthereum)?.ethereum;

export enum WalletEnum {
  Metamask = 'Metamask',
  Nifty = 'Nifty',
  Liquality = 'Liquality',
  // Portis = 'Portis',
}

export type WalletConfig = {
  name: WalletEnum;
  icon: string;
  connector: AbstractConnector;
  checkConnection: () => string | undefined;
};

export const wallets: WalletConfig[] = [
  {
    name: WalletEnum.Metamask,
    icon: metamaskIcon,
    connector: injectedConnector,
    checkConnection: () => {
      if (!ethereum || !ethereum.isMetaMask) {
        return '🦊 You must install Metamask into your browser and make sure it is set as the default wallet.';
      }
    },
  },
  {
    name: WalletEnum.Nifty,
    icon: niftyIcon,
    connector: injectedConnector,
    checkConnection: () => {
      if (!ethereum || !ethereum.isNiftyWallet) {
        return '👛 You must install Nifty into your browser and make sure it is set as the default wallet.';
      }
    },
  },
  {
    name: WalletEnum.Liquality,
    icon: liqualityIcon,
    connector: injectedConnector,
    checkConnection: () => {
      if (!ethereum || !ethereum.isLiquality) {
        return '🔵🟣 You must install Liquality into your browser and make sure it is set as the default wallet.';
      }
    },
  },
  // {
  //   name: WalletEnum.Portis,
  //   icon: portisIcon,
  //   connector: providerProvider, // TODO: fix portis errors
  //   // connector: injectedConnector,
  //   checkConnection: () => {},
  // },
];
