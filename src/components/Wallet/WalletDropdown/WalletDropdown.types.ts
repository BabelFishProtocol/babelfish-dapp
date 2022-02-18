import { WalletConfig } from '../../../config/wallets';

export type WalletOptionProps = Pick<WalletConfig, 'name' | 'icon'> & {
  walletId: number;
  tryActivation: (walletId: number) => Promise<void>;
};

export type WalletDropdownProps = {
  wallets: WalletConfig[];
  setConnectedWallet: (wallet: number | undefined) => void;
};
