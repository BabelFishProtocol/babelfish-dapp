import { WalletConfig } from '../../../config/wallets';

export type WalletOptionProps = Omit<WalletConfig, 'connector'> & {
  walletId: number;
  tryActivation: (walletId: number) => Promise<void>;
};

export type WalletDropdownProps = {
  wallets: WalletConfig[];
  setConnectedWallet: (wallet: number | undefined) => void;
};
