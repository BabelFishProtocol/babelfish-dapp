import { AbstractConnector } from '@web3-react/abstract-connector';
import { injectedConnector } from './providers';

import metamaskIcon from '../assets/icons/metamask-icon.webp';
import liqualityIcon from '../assets/icons/liquality.png';
import { WindowWithEthereum } from '../utils/types';

const ethereum = (window as WindowWithEthereum)?.ethereum;

export enum WalletEnum {
  Metamask = 'Metamask',
  Liquality = 'Liquality',
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
    name: WalletEnum.Liquality,
    icon: liqualityIcon,
    connector: injectedConnector,
    checkConnection: () => {
      if (!ethereum || !ethereum.isLiquality) {
        return '🔵🟣 You must install Liquality into your browser and make sure it is set as the default wallet.';
      }
    },
  },
];
