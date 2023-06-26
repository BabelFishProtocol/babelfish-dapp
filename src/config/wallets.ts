import { BoxProps } from '@mui/material';
import ledgerIcon from '../assets/icons/ledger.svg';
import trezorIcon from '../assets/icons/trezor.svg';
import metamaskIcon from '../assets/icons/metamask.svg';
import liqualityIcon from '../assets/icons/liquality.svg';
import walletConnectIcon from '../assets/icons/walletConnect.svg';

export enum WalletEnum {
  Metamask = 'Metamask',
  Liquality = 'Liquality',
  Ledger = 'Ledger',
  Trezor = 'Trezor',
  WalletConnect = 'WalletConnect',
}

export type WalletConfig = {
  name: WalletEnum;
  icon: string;
  sx?: BoxProps['sx'];
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
    icon: ledgerIcon,
    sx: {
      backgroundColor: 'white',
    },
  },
  {
    name: WalletEnum.Trezor,
    icon: trezorIcon,
    sx: {
      backgroundColor: 'white',
    },
  },
  {
    name: WalletEnum.WalletConnect,
    icon: walletConnectIcon,
  },
];
