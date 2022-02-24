import { createSelector } from '@reduxjs/toolkit';
import { Contract, Signer, utils } from 'ethers';
import { RootState } from '..';
import { chains } from '../../config/chains';
import {
  contractsAddresses,
  ContractsForNetwork,
} from '../../config/contracts';
import { Reducers } from '../../constants';
import { Staking__factory } from '../../contracts/types';

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

type BaseFactory = {
  connect: (address: string, signer: Signer) => Contract;
};

const createContractSelector = <Factory extends BaseFactory>(
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