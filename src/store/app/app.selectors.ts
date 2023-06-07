import { ContractInterface, ethers, utils } from 'ethers';
import { createSelector } from '@reduxjs/toolkit';

import {
  Provider as MulticallProvider,
  setMulticallAddress,
} from 'ethers-multicall';
import { ChainIds, getProvider } from '@sovryn/ethers-provider';
import { RootState } from '..';
import {
  contractsAddresses,
  ContractsForNetwork,
} from '../../config/contracts';
import { Reducers } from '../../constants';
import {
  allChainsArr,
  ChainEnum,
  chains,
  idsOfTestNetworks,
  mainnetChainsArr,
  testnetChainsArr,
} from '../../config/chains';
import { subgraphClients, subgraphWsClients } from '../../config/subgraph';
import {
  ERC20__factory,
  Staking__factory,
  Multicall__factory,
  VestingRegistry__factory,
  GovernorAlpha__factory,
  RewardManager__factory,
} from '../../contracts/types';
import { BaseContractFactory, MulticallProviderType } from '../types';
import { hasLocalTransactions } from './app.slice';

const appState = (state: RootState) => state[Reducers.App];

export const connectedWalletSelector = createSelector(
  appState,
  (state) => state.connectedWallet
);

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

export const supportedNetworksSelector = createSelector(
  appState,
  (state) => state.supportedNetworks
);

export const errorMessageSelector = createSelector(
  appState,
  (state) => state.errorMessage
);

export const supportedNetworksNamesSelector = createSelector(
  supportedNetworksSelector,
  (supportedNetworks) => supportedNetworks.map((item) => chains[item].name)
);

export const wrongNetworkModalSelector = createSelector(
  appState,
  (state) => state.wrongNetworkModal
);

export const walletNotConnectedModalSelector = createSelector(
  appState,
  (state) => state.walletNotConnectedModal
);

export const unsupportedNetworkSelector = createSelector(
  [supportedNetworksSelector, chainIdSelector],
  (supportedNetworks, chainId) => {
    if (!supportedNetworks || !chainId) {
      return false;
    }
    return !supportedNetworks.includes(chainId);
  }
);

export const testnetMainnetSelector = createSelector(
  chainIdSelector,
  (chainId) => {
    if (!chainId) return undefined;

    return idsOfTestNetworks.includes(chainId) ? 'testnet' : 'mainnet';
  }
);

export const chainsInCurrentNetworkSelector = createSelector(
  testnetMainnetSelector,
  (testnetMainnet) => {
    if (testnetMainnet === undefined) return [];

    return testnetMainnet === 'testnet' ? testnetChainsArr : mainnetChainsArr;
  }
);

export const supportedChainsInCurrentNetworkSelector = createSelector(
  [supportedNetworksSelector, chainsInCurrentNetworkSelector],
  (supportedNetworks, chainsInCurrentNetwork) => {
    if (!supportedNetworks?.length || !chainsInCurrentNetwork?.length)
      return [];

    return chainsInCurrentNetwork.filter(({ id }) =>
      supportedNetworks.includes(id)
    );
  }
);

export const currentChainSelector = createSelector(
  chainIdSelector,
  (chainId) => {
    if (!chainId) return undefined;

    const currentChain = allChainsArr.find(
      (chain) => chain.chainId === utils.hexlify(chainId)
    );

    return currentChain;
  }
);

// In case we need more subgraphs in the future, we need to have more selectors like this
export const subgraphClientSelector = createSelector(
  testnetMainnetSelector,
  (testnetMainnet) => {
    if (!testnetMainnet) {
      return undefined;
    }

    const chain =
      testnetMainnet === 'testnet' ? ChainEnum.RSK_TESTNET : ChainEnum.RSK;

    return subgraphClients[chain];
  }
);

export const subgraphWsClientSelector = createSelector(
  testnetMainnetSelector,
  (testnetMainnet) => {
    if (!testnetMainnet) {
      return undefined;
    }

    const chain =
      testnetMainnet === 'testnet' ? ChainEnum.RSK_TESTNET : ChainEnum.RSK;

    return subgraphWsClients[chain];
  }
);

export const addressesSelector = createSelector(
  currentChainSelector,
  (chainConfig) => {
    if (
      !chainConfig ||
      !(
        chainConfig.id === ChainEnum.RSK ||
        chainConfig.id === ChainEnum.RSK_TESTNET
      )
    )
      return undefined;

    return contractsAddresses[chainConfig.id];
  }
);

const getDefaultChainSelector = createSelector(
  testnetMainnetSelector,
  (environment) => {
    const chain =
      !environment || environment === 'mainnet'
        ? ChainIds.RSK_MAINNET
        : ChainIds.RSK_TESTNET;

    return chain;
  }
);

export const addressesSelectorDefaultChain = createSelector(
  getDefaultChainSelector,
  (defaultChain) => {
    if (!defaultChain) return undefined;

    const chain =
      defaultChain === ChainIds.RSK_MAINNET
        ? ChainEnum.RSK
        : ChainEnum.RSK_TESTNET;

    return contractsAddresses[chain];
  }
);

const getDefaultChainProviderSelector = createSelector(
  getDefaultChainSelector,
  (defaultChain) => {
    if (!defaultChain) {
      return undefined;
    }

    return getProvider(defaultChain);
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

const createDefaultChainContractSelector = (
  abi: ContractInterface,
  name: keyof ContractsForNetwork
) =>
  createSelector(
    [getDefaultChainProviderSelector, addressesSelectorDefaultChain],
    (chainProvider, addresses) => {
      if (!chainProvider || !addresses) {
        return undefined;
      }

      return new ethers.Contract(addresses[name], abi, chainProvider);
    }
  );

// TODO: All contracts from contracts.ts should be created by createDefaultChainContractSelector
export const stakingContractSelectorDefaultChain =
  createDefaultChainContractSelector(Staking__factory.abi, 'staking');

export const stakingContractSelector = createContractSelector(
  Staking__factory,
  'staking'
);

export const fishTokenSelector = createContractSelector(
  ERC20__factory,
  'fishToken'
);
export const governorAdminSelector = createContractSelector(
  GovernorAlpha__factory,
  'governorAdmin'
);
export const governorOwnerSelector = createContractSelector(
  GovernorAlpha__factory,
  'governorOwner'
);
export const multicallContractSelector = createContractSelector(
  Multicall__factory,
  'multicall'
);
export const vestingRegistrySelector = createContractSelector(
  VestingRegistry__factory,
  'vestingRegistry'
);
export const rewardManagerSelector = createContractSelector(
  RewardManager__factory,
  'rewardManager'
);

export const multicallProviderSelector = createSelector(
  [providerSelector, chainIdSelector, multicallContractSelector],
  (provider, chainId, multicallContract) => {
    if (!provider || !chainId || !multicallContract) return undefined;

    setMulticallAddress(chainId, multicallContract.address);
    const multicallProvider = new MulticallProvider(provider, chainId);

    return multicallProvider as MulticallProviderType;
  }
);

export const xusdLocalTransactionsSelector = createSelector(
  [appState],
  (state) =>
    hasLocalTransactions(state)
      ? state.xusdLocalTransactions[state.chainId][state.account]
      : undefined
);
