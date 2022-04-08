import { BoxProps } from '@mui/material/Box';
import { WalletEnum } from '../../../config/wallets';

export type WalletIconProps = {
  name: WalletEnum;
  icon: string;
  sx?: BoxProps['sx'];
};
