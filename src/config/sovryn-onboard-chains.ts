import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';

import { Environments } from '../types/global';
import { RSK_EXPLORER, RSK_RPC } from '../constants/infrastructure';

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
}

const mainnetChains: Chain[] = [
  {
    id: ChainIds.RSK_MAINNET,
    label: 'Rootstock',
    token: 'RBTC',
    rpcUrl: RSK_RPC[Environments.Mainnet],
    blockExplorerUrl: RSK_EXPLORER[Environments.Mainnet],
  },
  {
    id: ChainIds.BSC_MAINNET,
    label: 'BSC',
    token: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorerUrl: 'https://bscscan.com/',
  },
  {
    id: '0x1', // TODO: Temporary fix for ChainIds.Mainnet as it has the value of 0x01 instead of 0x1, verified the correct hex value at https://chainlist.org/
    label: 'Ethereum Mainnet',
    token: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorerUrl: 'https://etherscan.io',
  },
];

const testnetChains: Chain[] = [
  {
    id: ChainIds.RSK_TESTNET,
    label: 'Rootstock testnet',
    token: 'tRBTC',
    rpcUrl: RSK_RPC[Environments.Testnet],
    blockExplorerUrl: RSK_EXPLORER[Environments.Testnet],
  },
];

const isMainnet = true; // We don't distinguish between mainnet and testnet so this should be always set to true, set it to false only for testnet debugging if necessary

export const defaultChainId = (
  isMainnet ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as string;

export const chains: Chain[] = [...mainnetChains, ...testnetChains];

setup(chains);
