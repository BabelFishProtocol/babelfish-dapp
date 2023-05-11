import metamaskIcon from '../assets/icons/metamask-icon.webp';
// import portisIcon from '../assets/icons/portis.svg';
import liqualityIcon from '../assets/icons/liquality.png';

export enum WalletEnum {
  Metamask = 'Metamask',
  Liquality = 'Liquality',
  Ledger = 'Ledger',
  Trezor = 'Trezor',
}

export type WalletConfig = {
  name: WalletEnum;
  icon: string;
};

export const wallets: WalletConfig[] = [
  {
    name: WalletEnum.Metamask,
    icon: metamaskIcon,
  },
  {
    name: WalletEnum.Liquality,
    icon: liqualityIcon,
  },
  {
    name: WalletEnum.Ledger,
    icon: liqualityIcon,
  },
  {
    name: WalletEnum.Trezor,
    icon: liqualityIcon,
  },
];
