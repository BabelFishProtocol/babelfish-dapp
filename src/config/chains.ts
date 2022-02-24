import { utils } from 'ethers';
import ethIcon from '../assets/icons/chains/eth.svg';
import bscIcon from '../assets/icons/chains/bsc.svg';
import rskIcon from '../assets/icons/chains/rsk.svg';
import { tokensCatalog, TokenTypeBase } from './tokens';

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
  icon?: string;
  id: ChainEnum;
  chainId: string;
  rpcUrls: string[];
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
};

export type BaseChainType = ChainType & {
  bassets: TokenTypeBase[];
};

export const chains: Record<ChainEnum, ChainType> = {
  [ChainEnum.ETH]: {
    name: 'ETH Network',
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
    name: 'BSC Network',
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
    name: 'BSC Testnet Network',
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
    name: 'RSK Network',
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
    name: 'RSK Testnet Network',
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

export const baseChains: BaseChainType[] = [
  {
    ...chains[ChainEnum.ETH],
    bassets: [
      tokensCatalog.USDT,
      tokensCatalog.USDC,
      tokensCatalog.DAI,
      tokensCatalog.USDP,
    ],
  },
  {
    ...chains[ChainEnum.BSC],
    bassets: [
      tokensCatalog.USDT,
      tokensCatalog.USDC,
      tokensCatalog.BUSD,
      tokensCatalog.DAI,
      tokensCatalog.USDP,
    ],
  },
];
