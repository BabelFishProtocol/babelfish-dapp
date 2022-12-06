/* eslint-disable no-sparse-arrays */
import usdtIcon from '../assets/icons/tokens/usdt.svg';
import daiIcon from '../assets/icons/tokens/dai.svg';
import usdcIcon from '../assets/icons/tokens/usdc.svg';
import busdIcon from '../assets/icons/tokens/busd.svg';
// import usdpIcon from '../assets/icons/tokens/usdp.svg';
import xusdIcon from '../assets/icons/tokens/xusd.svg';
import rdocIcon from '../assets/icons/tokens/rdoc.svg';
import { ChainEnum } from './chains';

export enum TokenEnum {
  USDT = 'USDT',
  USDC = 'USDC',
  BUSD = 'BUSD',
  DAI = 'DAI',
  // USDP = 'USDP',
  XUSD = 'XUSD',
  RDOC = 'RDOC',
  SEPUSD = 'SEPUSD',
  // BDUS = 'BDUS',
  // ZUSD = 'ZUSD',
}

export interface TokenTypeBase {
  id: TokenEnum;
  name: string;
  icon: string;
  addresses: Partial<Record<Partial<ChainEnum>, string>>;
}

export const tokenOnChain = {
  [TokenEnum.USDT]: {
    [ChainEnum.BSC]: '0x55d398326f99059ff775485246999027b3197955',
    [ChainEnum.ETH]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    [ChainEnum.ETH_TESTNET]: '0xff364ffa4962cb172203a5be01d17cf3fef02419',
  },
  [TokenEnum.BUSD]: {
    [ChainEnum.BSC]: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  },
  [TokenEnum.DAI]: {
    [ChainEnum.BSC]: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    [ChainEnum.ETH]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    [ChainEnum.ETH_TESTNET]: '0x974cf21396D4D29F8e63Ac07eCfcbaB51a739bc9',
  },
  [TokenEnum.USDC]: {
    [ChainEnum.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    [ChainEnum.ETH]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    [ChainEnum.ETH_TESTNET]: '0x4C68058992b8aD1243eE23A5923023C0e15Cf43F',
  },
  [TokenEnum.XUSD]: {
    [ChainEnum.RSK]: '0xb5999795be0ebb5bab23144aa5fd6a02d080299f',
    [ChainEnum.RSK_TESTNET]: '0xa9262cc3fb54ea55b1b0af00efca9416b8d59570',
  },
  [TokenEnum.SEPUSD]: {
    [ChainEnum.ETH_TESTNET]: '0x7f357b8D3293CD631907d33a500f2C9Ce7f9B90D',
  },
} as const;

type TokensType = Record<Partial<TokenEnum>, TokenTypeBase>;

export const tokens: TokensType = {
  [TokenEnum.USDT]: {
    id: TokenEnum.USDT,
    name: 'USDT',
    icon: usdtIcon,
    addresses: tokenOnChain[TokenEnum.USDT],
  },
  [TokenEnum.USDC]: {
    id: TokenEnum.USDC,
    name: 'USDC',
    icon: usdcIcon,
    addresses: tokenOnChain[TokenEnum.USDC],
  },
  [TokenEnum.DAI]: {
    id: TokenEnum.DAI,
    name: 'DAI',
    icon: daiIcon,
    addresses: tokenOnChain[TokenEnum.DAI],
  },
  [TokenEnum.BUSD]: {
    id: TokenEnum.BUSD,
    name: 'BUSD',
    icon: busdIcon,
    addresses: tokenOnChain.BUSD,
  },
  [TokenEnum.XUSD]: {
    id: TokenEnum.XUSD,
    name: TokenEnum.XUSD,
    icon: xusdIcon,
    addresses: tokenOnChain.XUSD,
  },
  [TokenEnum.RDOC]: {
    id: TokenEnum.RDOC,
    name: TokenEnum.RDOC,
    icon: rdocIcon,
    addresses: {
      [ChainEnum.RSK]: '0x2d919f19d4892381d58edebeca66d5642cef1a1f',
      [ChainEnum.RSK_TESTNET]: '0xC3De9f38581F83e281F260D0ddBAac0E102Ff9F8',
    },
  },
  [TokenEnum.SEPUSD]: {
    id: TokenEnum.SEPUSD,
    name: TokenEnum.SEPUSD,
    icon: usdtIcon,
    addresses: tokenOnChain.SEPUSD,
  },
  // [TokenEnum.BDUS]: {
  //   id: TokenEnum.BDUS,
  //   name: TokenEnum.BDUS,
  //   icon: rdocIcon, // not provided yet
  //   addresses: {
  //     [ChainEnum.RSK]: '0xB450ff06d950eFA9A9c0aD63790C51971C1BE885',
  //     [ChainEnum.RSK_TESTNET]: '0xB450ff06d950eFA9A9c0aD63790C51971C1BE885', // not provided yet - the same as RSK
  //   },
  // },
  // [TokenEnum.ZUSD]: {
  //   id: TokenEnum.ZUSD,
  //   name: TokenEnum.ZUSD,
  //   icon: rdocIcon, // not provided yet
  //   addresses: {
  //     [ChainEnum.RSK]: '0x4A0741FA749Ed6b1F810224D09f1f511952e67De', // not provided yet - the same as RSK testnet
  //     [ChainEnum.RSK_TESTNET]: '0x4A0741FA749Ed6b1F810224D09f1f511952e67De',
  //   },
  // },
} as const;
