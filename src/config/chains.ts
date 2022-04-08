import { utils } from 'ethers';
import ethIcon from '../assets/icons/chains/eth.svg';
import bscIcon from '../assets/icons/chains/bsc.svg';
import rskIcon from '../assets/icons/chains/rsk.svg';

export enum ChainEnum {
  ETH = 1,
  ETH_TESTNET = 3,
  BSC = 56,
  BSC_TESTNET = 97,
  RSK = 30,
  RSK_TESTNET = 31,
}

export type ChainType = {
  name: string;
  icon: string;
  id: ChainEnum;
  chainId: string;
  rpcUrls: string[];
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
};

export const chains: Record<ChainEnum, ChainType> = {
  [ChainEnum.ETH]: {
    name: 'ETH Mainnet',
    icon: ethIcon,
    id: ChainEnum.ETH,
    chainId: utils.hexlify(ChainEnum.ETH),
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [ChainEnum.ETH_TESTNET]: {
    name: 'Ropsten',
    icon: ethIcon,
    id: ChainEnum.ETH_TESTNET,
    chainId: utils.hexlify(ChainEnum.ETH_TESTNET),
    rpcUrls: ['https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [ChainEnum.BSC]: {
    name: 'BNB Chain',
    icon: bscIcon,
    id: ChainEnum.BSC,
    chainId: utils.hexlify(ChainEnum.BSC),
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    nativeCurrency: {
      symbol: 'BNB',
      decimals: 18,
    },
  },
  [ChainEnum.BSC_TESTNET]: {
    name: 'BNB Chain Testnet',
    icon: bscIcon,
    id: ChainEnum.BSC_TESTNET,
    chainId: utils.hexlify(ChainEnum.BSC_TESTNET),
    rpcUrls: ['https://data-seed-prebsc-2-s3.binance.org:8545'],
    nativeCurrency: {
      symbol: 'BNB',
      decimals: 18,
    },
  },
  [ChainEnum.RSK]: {
    name: 'RSK',
    icon: rskIcon,
    id: ChainEnum.RSK,
    chainId: utils.hexlify(ChainEnum.RSK),
    rpcUrls: ['https://public-node.rsk.co'],
    nativeCurrency: {
      symbol: 'RBTC',
      decimals: 18,
    },
  },
  [ChainEnum.RSK_TESTNET]: {
    name: 'RSK Testnet',
    icon: rskIcon,
    id: ChainEnum.RSK_TESTNET,
    chainId: utils.hexlify(ChainEnum.RSK_TESTNET),
    rpcUrls: ['https://testnet.sovryn.app/rpc'],
    nativeCurrency: {
      symbol: 'RBTC',
      decimals: 18,
    },
  },
};

export const SUPPORTED_CHAINS_RSK = [ChainEnum.RSK, ChainEnum.RSK_TESTNET];

export const SUPPORTED_CHAINS = Object.values(ChainEnum).filter(
  (item) => typeof item === 'number'
) as ChainEnum[];
