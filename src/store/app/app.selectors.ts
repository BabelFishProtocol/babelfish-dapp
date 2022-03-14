import { utils } from 'ethers';
import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import {
  contractsAddresses,
  ContractsForNetwork,
} from '../../config/contracts';
import { Reducers } from '../../constants';
import { chains } from '../../config/chains';
import {
  ERC20__factory,
  Staking__factory,
  VestingRegistry__factory,
} from '../../contracts/types';
import { BaseContractFactory } from '../types';

const appState = (state: RootState) => state[Reducers.App];

export const chainIdSelector = createSelector(
  appState,
  (state) => state.chainId
);
export const accountSelector = createSelector(
  appState,
  (state) => state.account
);
export const providerSelector = createSelector(
  appState,
  (state) => state.provider
);
export const currentBlockSelector = createSelector(
  appState,
  (state) => state.currentBlockNumber
);
export const currentChainSelector = createSelector(
  chainIdSelector,
  (chainId) => {
    if (chainId === undefined) return undefined;

    const chainConfig = Object.values(chains).find(
      (chain) => chain.chainId === utils.hexlify(chainId)
    );

    return chainConfig;
  }
);
export const addressesSelector = createSelector(
  currentChainSelector,
  (chainConfig) => {
    if (!chainConfig || !contractsAddresses[chainConfig.id]) return undefined;

    return contractsAddresses[chainConfig.id];
  }
);

const createContractSelector = <Factory extends BaseContractFactory>(
  factory: Factory,
  name: keyof ContractsForNetwork
) =>
  createSelector(
    [providerSelector, addressesSelector],
    (provider, addresses) => {
      if (!addresses || !provider) {
        return undefined;
      }

      const contract = factory.connect(addresses[name], provider.getSigner());
      return contract as ReturnType<Factory['connect']>;
    }
  );

export const stakingContractSelector = createContractSelector(
  Staking__factory,
  'staking'
);
export const fishTokenSelector = createContractSelector(
  ERC20__factory,
  'fishToken'
);
export const vestingRegistrySelector = createContractSelector(
  VestingRegistry__factory,
  'vestingRegistry'
);
