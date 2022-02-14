/* eslint-disable no-sparse-arrays */
import usdtIcon from '../assets/icons/tokens/usdt.svg';
import daiIcon from '../assets/icons/tokens/dai.svg';
import usdcIcon from '../assets/icons/tokens/usdc.svg';
import busdIcon from '../assets/icons/tokens/busd.svg';
import usdpIcon from '../assets/icons/tokens/usdp.svg';

export enum TokenEnum {
  USDT = 'USDT',
  USDC = 'USDC',
  BUSD = 'BUSD',
  DAI = 'DAI',
  USDP = 'USDP',
}

export type TokenOnNetworkType = {
  symbol: string;
  address: string;
  oAddress?: string;
  decimals: number;
};

export interface TokenTypeBase {
  id: string;
  name: string;
  icon?: string;
}

// export const tokensOrder = [
//   TokenEnum.USDT,
//   TokenEnum.USDC,
//   TokenEnum.BUSD,
//   TokenEnum.DAI,
//   TokenEnum.USDP,
// ];

export const tokensCatalog = {
  [TokenEnum.USDT]: {
    id: 'USDT',
    name: 'USDT',
    icon: usdtIcon,
  },
  [TokenEnum.USDC]: {
    id: 'USDc',
    name: 'USDC',
    icon: usdcIcon,
  },
  [TokenEnum.DAI]: {
    id: 'DAI',
    name: 'DAI',
    icon: daiIcon,
  },
  [TokenEnum.BUSD]: {
    id: 'BUSD',
    name: 'BUSD',
    icon: busdIcon,
  },
  [TokenEnum.USDP]: {
    id: 'PAX',
    name: 'PAX',
    icon: usdpIcon,
  },
};
