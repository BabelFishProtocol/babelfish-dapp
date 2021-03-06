import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { WalletEnum, WalletConfig } from '../../../config/wallets';

export type WalletOptionProps = Pick<WalletConfig, 'name' | 'icon'> & {
  walletIndex: number;
  tryActivation: (walletId: number) => Promise<void>;
};

export type WalletDropdownProps = {
  activate: Web3ReactContextInterface['activate'];
  wallets: WalletConfig[];
  setConnectedWallet: (wallet: WalletEnum) => void;
};
