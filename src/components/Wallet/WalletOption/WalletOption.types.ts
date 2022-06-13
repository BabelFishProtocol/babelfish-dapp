import { ChainEnum } from '../../../config/chains';
import { WalletConfig } from '../../../config/wallets';

export type WalletOptionProps = {
  index: number;
  name: WalletConfig['name'] | string;
  icon?: WalletConfig['icon'];
  handleClick: (id: number | ChainEnum) => Promise<void>;
  autoFocus?: boolean;
};
