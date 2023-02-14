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
    [ChainEnum.RSK_TESTNET]: '0xC3De9f38581F83e281F260D0ddBAac0E102Ff9F8',
  },
  [TokenEnum.DOC]: {
    [ChainEnum.RSK]: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
    [ChainEnum.RSK_TESTNET]: '0xCb46C0DdC60d18eFEB0e586c17AF6Ea36452DaE0',
  },
  [TokenEnum.RUSDT]: {
    [ChainEnum.RSK]: '0xEf213441a85DF4d7acBdAe0Cf78004E1e486BB96',
    [ChainEnum.RSK_TESTNET]: '0x4d5A316d23EBe168D8f887b4447BF8DBfA4901cc',
  },
  [TokenEnum.ZUSD]: {
    [ChainEnum.RSK]: '0xdB107FA69E33f05180a4C2cE9c2E7CB481645C2d',
    [ChainEnum.RSK_TESTNET]: '0x6B41566353D6c7b8C2A7931d498f11489dacac29',
  },
  [TokenEnum.DLLR]: {
    [ChainEnum.RSK]: '0x007b3AA69A846cB1f76b60b3088230A52D2A83AC', // TODO: Change it once we have mainnet deployment, this is a testnet address
    [ChainEnum.RSK_TESTNET]: '0x007b3AA69A846cB1f76b60b3088230A52D2A83AC',
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
} as const;
