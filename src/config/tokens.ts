/* eslint-disable no-sparse-arrays */
import usdtIcon from '../assets/icons/tokens/usdt.svg';
import daiIcon from '../assets/icons/tokens/dai.svg';
import usdcIcon from '../assets/icons/tokens/usdc.svg';
import busdIcon from '../assets/icons/tokens/busd.svg';
import usdpIcon from '../assets/icons/tokens/usdp.svg';
import xusdIcon from '../assets/icons/tokens/xusd.svg';

export enum TokenEnum {
  USDT = 'USDT',
  USDC = 'USDC',
  BUSD = 'BUSD',
  DAI = 'DAI',
  USDP = 'USDP',
  XUSD = 'XUSD',
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
  icon: string;
}

// export const tokensOrder = [
//   TokenEnum.USDT,
//   TokenEnum.USDC,
//   TokenEnum.BUSD,
//   TokenEnum.DAI,
//   TokenEnum.USDP,
// ];

export const tokens = {
  [TokenEnum.USDT]: {
    id: TokenEnum.USDT,
    name: 'USDT',
    icon: usdtIcon,
  },
  [TokenEnum.USDC]: {
    id: TokenEnum.USDC,
    name: 'USDC',
    icon: usdcIcon,
  },
  [TokenEnum.DAI]: {
    id: TokenEnum.DAI,
    name: 'DAI',
    icon: daiIcon,
  },
  [TokenEnum.BUSD]: {
    id: TokenEnum.BUSD,
    name: 'BUSD',
    icon: busdIcon,
  },
  [TokenEnum.USDP]: {
    id: TokenEnum.USDP,
    name: 'PAX',
    icon: usdpIcon,
  },
  [TokenEnum.XUSD]: {
    id: TokenEnum.XUSD,
    name: TokenEnum.XUSD,
    icon: xusdIcon,
  },
};
