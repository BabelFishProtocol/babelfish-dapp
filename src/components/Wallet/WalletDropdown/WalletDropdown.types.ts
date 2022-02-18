import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { WalletConfig } from '../../../config/wallets';

export type WalletOptionProps = Pick<WalletConfig, 'name' | 'icon'> & {
  walletId: number;
  tryActivation: (walletId: number) => Promise<void>;
};

export type WalletDropdownProps = {
  activate: Web3ReactContextInterface['activate'];
  wallets: WalletConfig[];
  setConnectedWallet: (wallet: number | undefined) => void;
};
