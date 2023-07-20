import usdtIcon from '../assets/icons/tokens/usdt.svg';
import daiIcon from '../assets/icons/tokens/dai.svg';
import usdcIcon from '../assets/icons/tokens/usdc.svg';
import busdIcon from '../assets/icons/tokens/busd.svg';
import xusdIcon from '../assets/icons/tokens/xusd.svg';
import rdocIcon from '../assets/icons/tokens/rdoc.svg';
import docIcon from '../assets/icons/tokens/doc.svg';
import zusdIcon from '../assets/icons/tokens/zusd.svg';
import dllrIcon from '../assets/icons/tokens/dllr.svg';
import { ChainEnum } from './chains';

export enum TokenEnum {
  USDT = 'USDT',
  USDC = 'USDC',
  BUSD = 'BUSD',
  DAI = 'DAI',
  XUSD = 'XUSD',
  RDOC = 'RDOC',
  SEPUSD = 'SEPUSD',
  DOC = 'DOC',
  RUSDT = 'RUSDT',
  ZUSD = 'ZUSD',
  DLLR = 'DLLR',
  TST1 = 'TST1',
  TST2 = 'TST2',
  TST3 = 'TST3',
  TST4 = 'TST4',
  TST5 = 'TST5',
  TST6 = 'TST6'
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
  [TokenEnum.RDOC]: {
    [ChainEnum.RSK]: '0x2d919f19d4892381d58edebeca66d5642cef1a1f',
    [ChainEnum.RSK_TESTNET]: '0xdbdc2d486c10c23902a46a17bec1f7de64075257',
  },
  [TokenEnum.DOC]: {
    [ChainEnum.RSK]: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
    [ChainEnum.RSK_TESTNET]: '0xad0d0d04ec0cf442204908fc2cc18503ead06d3e',
  },
  [TokenEnum.RUSDT]: {
    [ChainEnum.RSK]: '0xEf213441a85DF4d7acBdAe0Cf78004E1e486BB96',
    [ChainEnum.RSK_TESTNET]: '0x71e14cb1d752b88215782f2d6af01327cb483a0e',
  },
  [TokenEnum.ZUSD]: {
    [ChainEnum.RSK]: '0xdB107FA69E33f05180a4C2cE9c2E7CB481645C2d',
    [ChainEnum.RSK_TESTNET]: '0x6B41566353D6c7b8C2A7931d498f11489dacac29',
  },
  [TokenEnum.DLLR]: {
    [ChainEnum.RSK]: '0x007b3AA69A846cB1f76b60b3088230A52D2A83AC', // TODO: Change it once we have mainnet deployment, this is a testnet address
    [ChainEnum.RSK_TESTNET]: '0x007b3AA69A846cB1f76b60b3088230A52D2A83AC',
  },
  [TokenEnum.TST1]: {
    [ChainEnum.RSK_TESTNET]: '0x9552f2e86b38b6545f7a3ff871b1f3e0023fa841',
  },
  [TokenEnum.TST2]: {
    [ChainEnum.RSK_TESTNET]: '0x36f737dcaf6b2480f3163602c7cf85c9661527d4',
  },
  [TokenEnum.TST3]: {
    [ChainEnum.RSK_TESTNET]: '0xf177355fffbf1096436c43354b6b653c08ff75ee',
  },
  [TokenEnum.TST4]: {
    [ChainEnum.RSK_TESTNET]: '0x12aff942bafc1394acc3fdef28f41fd3f008b32d',
  },
  [TokenEnum.TST5]: {
    [ChainEnum.RSK_TESTNET]: '0x02adba17629c1c9a99d541ba30cc65d6862e260a',
  },
  [TokenEnum.TST6]: {
    [ChainEnum.RSK_TESTNET]: '0xd1179afa75dcdeaa5bd6c0da705e67d268a2d7c3',
  },
} as const;

type TokensType = Record<Partial<TokenEnum>, TokenTypeBase>;

export const tokens: TokensType = {
  [TokenEnum.USDT]: {
    id: TokenEnum.USDT,
    name: TokenEnum.USDT,
    icon: usdtIcon,
    addresses: tokenOnChain.USDT,
  },
  [TokenEnum.USDC]: {
    id: TokenEnum.USDC,
    name: TokenEnum.USDC,
    icon: usdcIcon,
    addresses: tokenOnChain.USDC,
  },
  [TokenEnum.DAI]: {
    id: TokenEnum.DAI,
    name: TokenEnum.DAI,
    icon: daiIcon,
    addresses: tokenOnChain.DAI,
  },
  [TokenEnum.BUSD]: {
    id: TokenEnum.BUSD,
    name: TokenEnum.BUSD,
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
    addresses: tokenOnChain.RDOC,
  },
  [TokenEnum.SEPUSD]: {
    id: TokenEnum.SEPUSD,
    name: TokenEnum.SEPUSD,
    icon: usdtIcon,
    addresses: tokenOnChain.SEPUSD,
  },
  [TokenEnum.DOC]: {
    id: TokenEnum.DOC,
    name: TokenEnum.DOC,
    icon: docIcon,
    addresses: tokenOnChain.DOC,
  },
  [TokenEnum.RUSDT]: {
    id: TokenEnum.RUSDT,
    name: TokenEnum.RUSDT,
    icon: usdtIcon,
    addresses: tokenOnChain.RUSDT,
  },
  [TokenEnum.ZUSD]: {
    id: TokenEnum.ZUSD,
    name: TokenEnum.ZUSD,
    icon: zusdIcon,
    addresses: tokenOnChain.ZUSD,
  },
  [TokenEnum.DLLR]: {
    id: TokenEnum.DLLR,
    name: TokenEnum.DLLR,
    icon: dllrIcon,
    addresses: tokenOnChain.DLLR,
  },
  [TokenEnum.TST1]: {
    id: TokenEnum.TST1,
    name: TokenEnum.TST1,
    icon: dllrIcon,
    addresses: tokenOnChain.TST1,
  },
  [TokenEnum.TST2]: {
    id: TokenEnum.TST2,
    name: TokenEnum.TST2,
    icon: dllrIcon,
    addresses: tokenOnChain.TST2,
  },
  [TokenEnum.TST3]: {
    id: TokenEnum.TST3,
    name: TokenEnum.TST3,
    icon: dllrIcon,
    addresses: tokenOnChain.TST3,
  },
  [TokenEnum.TST4]: {
    id: TokenEnum.TST4,
    name: TokenEnum.TST4,
    icon: dllrIcon,
    addresses: tokenOnChain.TST4,
  },
  [TokenEnum.TST5]: {
    id: TokenEnum.TST5,
    name: TokenEnum.TST5,
    icon: dllrIcon,
    addresses: tokenOnChain.TST5,
  },
  [TokenEnum.TST6]: {
    id: TokenEnum.TST6,
    name: TokenEnum.TST6,
    icon: dllrIcon,
    addresses: tokenOnChain.TST6,
  },
} as const;
