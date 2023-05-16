import { WalletConfig } from '../../../config/wallets';

export type WalletOptionProps = Pick<WalletConfig, 'name' | 'icon'> & {
  walletIndex: number;
  tryActivation: (walletId: number) => Promise<void>;
};

export type WalletDropdownProps = {
  activate: () => void;
  wallets: WalletConfig[];
};
