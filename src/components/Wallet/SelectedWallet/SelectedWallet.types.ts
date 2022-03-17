import { WalletConfig } from '../../../config/wallets';

export type SelectedWalletProps = {
  account: string;
  wallet: WalletConfig;
  onDisconnect: () => void;
};
