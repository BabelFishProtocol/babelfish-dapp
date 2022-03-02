import ethIcon from '../assets/icons/chains/eth.svg';
import bscIcon from '../assets/icons/chains/bsc.svg';
import rskIcon from '../assets/icons/chains/rsk.svg';

// const IS_MAINNET = process.env.REACT_APP_PRODUCTION_CHAINS === 'TRUE';
const IS_MAINNET = false;

export enum ChainEnum {
  ETH = 'ETH',
  BSC = 'BSC',
  RSK = 'RSK',
}

export type ChainType = {
  name: string;
  id: ChainEnum;
  icon: string;
  chainId: string;
  rpcUrls: string[];
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
};

export const chains = {
  [ChainEnum.ETH]: {
    name: 'ETH Network',
    id: ChainEnum.ETH,
    icon: ethIcon,
    chainId: `0x${(IS_MAINNET ? 1 : 3).toString(16)}`,
    rpcUrls: [
      IS_MAINNET
        ? 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
        : 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    ],
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [ChainEnum.BSC]: {
    name: 'BSC Network',
    id: ChainEnum.BSC,
    icon: bscIcon,
    chainId: `0x${Number(IS_MAINNET ? 56 : 97).toString(16)}`,
    rpcUrls: [
      IS_MAINNET
        ? 'https://bsc-dataseed.binance.org'
        : 'https://data-seed-prebsc-2-s3.binance.org:8545',
    ],
    nativeCurrency: {
      symbol: 'BNB',
      decimals: 18,
    },
  },
  [ChainEnum.RSK]: {
    name: 'RSK Network',
    id: ChainEnum.RSK,
    icon: rskIcon,
    chainId: `0x${Number(IS_MAINNET ? 30 : 31).toString(16)}`,
    rpcUrls: [
      IS_MAINNET
        ? 'https://public-node.rsk.co'
        : 'https://testnet.sovryn.app/rpc',
    ],
    nativeCurrency: {
      symbol: 'RBTC',
      decimals: 18,
    },
  },
};
