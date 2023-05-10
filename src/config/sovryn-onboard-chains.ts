import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';

import { Environments } from '../types/global';
import { RSK_EXPLORER, RSK_RPC } from '../constants/infrastructure';

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
}

const isMainnet = true; // TODO: Just for testing, needs to be refactored later

export const defaultChainId = (
  isMainnet ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as string;

// @dev: temp solution for hardware wallets to connect to the correct chain
// good enough for now, but should be refactored when cross-chain support is needed
export const chains: Chain[] = [
  isMainnet
    ? {
        id: ChainIds.RSK_MAINNET,
        label: 'Rootstock',
        token: 'RBTC',
        rpcUrl: RSK_RPC[Environments.Mainnet],
        blockExplorerUrl: RSK_EXPLORER[Environments.Mainnet],
      }
    : {
        id: ChainIds.RSK_TESTNET,
        label: 'Rootstock testnet',
        token: 'tRBTC',
        rpcUrl: RSK_RPC[Environments.Testnet],
        blockExplorerUrl: RSK_EXPLORER[Environments.Testnet],
      },
];

setup(chains);