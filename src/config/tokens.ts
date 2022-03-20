/* eslint-disable no-sparse-arrays */
import usdtIcon from '../assets/icons/tokens/usdt.svg';
import daiIcon from '../assets/icons/tokens/dai.svg';
import usdcIcon from '../assets/icons/tokens/usdc.svg';
import busdIcon from '../assets/icons/tokens/busd.svg';
// import usdpIcon from '../assets/icons/tokens/usdp.svg';
import xusdIcon from '../assets/icons/tokens/xusd.svg';
import { ChainEnum } from './chains';

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
  addresses: Partial<Record<Partial<ChainEnum>, string>>;
}
export type TokenOnNetworkType = {
  address: string;
};

type TokensType = Record<Partial<TokenEnum>, TokenTypeBase>;

export const tokens: TokensType = {
  [TokenEnum.USDT]: {
    id: TokenEnum.USDT,
    name: 'USDT',
    icon: usdtIcon,
    decimals: 6,
    addresses: {
      [ChainEnum.ETH]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      [ChainEnum.BSC]: '0x55d398326f99059ff775485246999027b3197955',
      [ChainEnum.ETH_TESTNET]: '',
      [ChainEnum.BSC_TESTNET]: '0x268e3bF855CbcDf8FE31bA3557a554aB2283351F',
    },
  },
  [TokenEnum.USDC]: {
    id: TokenEnum.USDC,
    name: 'USDC',
    icon: usdcIcon,
    decimals: 6,
    addresses: {
      [ChainEnum.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      [ChainEnum.ETH]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [ChainEnum.BSC_TESTNET]: '0x0b654C687dC8b828139406c070E0A34486e5072b',
      [ChainEnum.ETH_TESTNET]: '',
    },
  },
  [TokenEnum.DAI]: {
    id: TokenEnum.DAI,
    name: 'DAI',
    icon: daiIcon,
    decimals: 18,
    addresses: {
      [ChainEnum.BSC]: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      [ChainEnum.ETH]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      [ChainEnum.BSC_TESTNET]: '0x83241490517384cB28382Bdd4D1534eE54d9350F',
      [ChainEnum.ETH_TESTNET]: '',
    },
  },
  [TokenEnum.BUSD]: {
    id: TokenEnum.BUSD,
    name: 'BUSD',
    icon: busdIcon,
    decimals: 6,
    addresses: {
      [ChainEnum.BSC]: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      [ChainEnum.BSC_TESTNET]: '0x137BEc8c83740920ebc4f29f51C7B65b75Beec83',
    },
  },
  [TokenEnum.XUSD]: {
    id: TokenEnum.XUSD,
    name: TokenEnum.XUSD,
    icon: xusdIcon,
    decimals: 18,
    addresses: {
      [ChainEnum.RSK]: '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
      [ChainEnum.RSK_TESTNET]: '0x152123ec3D9fe2Cf57aBc09917C1ba51324EA8dE',
    },
  },
};

export const tokenOnChain = {
  [TokenEnum.USDT]: {
    [ChainEnum.ETH]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    [ChainEnum.BSC]: '0x55d398326f99059ff775485246999027b3197955',
    [ChainEnum.ETH_TESTNET]: '',
    [ChainEnum.BSC_TESTNET]: '0x268e3bF855CbcDf8FE31bA3557a554aB2283351F',
  },
  [TokenEnum.BUSD]: {
    [ChainEnum.BSC]: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    [ChainEnum.BSC_TESTNET]: '0x137BEc8c83740920ebc4f29f51C7B65b75Beec83',
  },
};
