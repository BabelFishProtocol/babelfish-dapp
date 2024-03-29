import { utils } from 'ethers';
import ethIcon from '../assets/icons/chains/eth.svg';
import bscIcon from '../assets/icons/chains/bsc.svg';
import rskIcon from '../assets/icons/chains/rsk.png';

export enum ChainEnum {
  ETH = 1,
  ETH_TESTNET = 11155111,
  BSC = 56,
  RSK = 30,
  RSK_TESTNET = 31,
}

type TestnetChains = ChainEnum.ETH_TESTNET | ChainEnum.RSK_TESTNET;

type MainnetChains = ChainEnum.BSC | ChainEnum.ETH | ChainEnum.RSK;

export type ChainType = {
  name: string;
  icon: string;
  id: ChainEnum;
  chainId: string;
  blockExplorerUrls?: string[];
  iconUrls?: string[];
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const testnetChains: Record<TestnetChains, ChainType> = {
  [ChainEnum.ETH_TESTNET]: {
    name: 'Sepolia',
    icon: ethIcon,
    id: ChainEnum.ETH_TESTNET,
    chainId: utils.hexlify(ChainEnum.ETH_TESTNET),
    rpcUrls: ['https://rpc.sepolia.dev'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'SepoliaETH',
      decimals: 18,
    },
  },
  [ChainEnum.RSK_TESTNET]: {
    name: 'Rootstock Testnet',
    icon: rskIcon,
    id: ChainEnum.RSK_TESTNET,
    chainId: utils.hexlify(ChainEnum.RSK_TESTNET),
    rpcUrls: ['https://testnet.sovryn.app/rpc'],
    blockExplorerUrls: ['https://explorer.testnet.rsk.co'],
    nativeCurrency: {
      name: 'RSK Smart Bitcoin',
      symbol: 'RBTC',
      decimals: 18,
    },
  },
};

export const mainnetChains: Record<MainnetChains, ChainType> = {
  [ChainEnum.ETH]: {
    name: 'ETH Mainnet',
    icon: ethIcon,
    id: ChainEnum.ETH,
    chainId: utils.hexlify(ChainEnum.ETH),
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: {
      name: 'Ether',
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
    blockExplorerUrls: ['https://bscscan.com'],
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  [ChainEnum.RSK]: {
    name: 'Rootstock',
    icon: rskIcon,
    id: ChainEnum.RSK,
    chainId: utils.hexlify(ChainEnum.RSK),
    rpcUrls: ['https://public-node.rsk.co'],
    blockExplorerUrls: ['https://explorer.rsk.co'],
    nativeCurrency: {
      name: 'RSK Smart Bitcoin',
      symbol: 'RBTC',
      decimals: 18,
    },
  },
};

export const chains: Record<ChainEnum, ChainType> = {
  ...mainnetChains,
  ...testnetChains,
};

export const testnetChainsArr = Object.values(testnetChains);
export const mainnetChainsArr = Object.values(mainnetChains);
export const allChainsArr = Object.values(chains);

export const idsOfTestNetworks = testnetChainsArr.map(({ id }) => id);

export const SUPPORTED_CHAINS_RSK = [ChainEnum.RSK, ChainEnum.RSK_TESTNET];

export const isRSK = (chain: ChainEnum | '') =>
  !!chain && SUPPORTED_CHAINS_RSK.includes(chain);
export const isNotRSK = (chain: ChainEnum | '') =>
  !!chain && !SUPPORTED_CHAINS_RSK.includes(chain);

export const checkIsCrossChain = (chain: ChainEnum) =>
  isNotRSK(chain) ? 'true' : undefined;

export const SUPPORTED_CHAINS = Object.values(ChainEnum).filter(
  (item) => typeof item === 'number'
) as ChainEnum[];
