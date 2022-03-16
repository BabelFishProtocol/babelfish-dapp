/* eslint-disable no-sparse-arrays */
import usdtIcon from '../assets/icons/tokens/usdt.svg';
import daiIcon from '../assets/icons/tokens/dai.svg';
import usdcIcon from '../assets/icons/tokens/usdc.svg';
import busdIcon from '../assets/icons/tokens/busd.svg';
// import usdpIcon from '../assets/icons/tokens/usdp.svg';
import xusdIcon from '../assets/icons/tokens/xusd.svg';

export enum TokenEnum {
  USDT = 'USDT',
  USDC = 'USDC',
  BUSD = 'BUSD',
  DAI = 'DAI',
  // USDP = 'USDP',
  XUSD = 'XUSD',
}

export interface TokenTypeBase {
  id: TokenEnum;
  name: string;
  icon: string;
  decimals: number;
}
export type TokenOnNetworkType = TokenTypeBase & {
  address: string;
};
// export const tokensOrder = [
//   TokenEnum.USDT,
//   TokenEnum.USDC,
//   TokenEnum.BUSD,
//   TokenEnum.DAI,
//   TokenEnum.USDP,
// ];

export const tokens: Record<Partial<TokenEnum>, TokenTypeBase> = {
  [TokenEnum.USDT]: {
    id: TokenEnum.USDT,
    name: 'USDT',
    icon: usdtIcon,
    decimals: 6,
  },
  [TokenEnum.USDC]: {
    id: TokenEnum.USDC,
    name: 'USDC',
    icon: usdcIcon,
    decimals: 6,
  },
  [TokenEnum.DAI]: {
    id: TokenEnum.DAI,
    name: 'DAI',
    icon: daiIcon,
    decimals: 18,
  },
  [TokenEnum.BUSD]: {
    id: TokenEnum.BUSD,
    name: 'BUSD',
    icon: busdIcon,
    decimals: 6,
  },
  [TokenEnum.XUSD]: {
    id: TokenEnum.XUSD,
    name: TokenEnum.XUSD,
    icon: xusdIcon,
    decimals: 18,
  },
};
