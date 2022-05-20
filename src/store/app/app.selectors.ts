import { utils } from 'ethers';
import { createSelector } from '@reduxjs/toolkit';

import {
  Provider as MulticallProvider,
  setMulticallAddress,
} from 'ethers-multicall';
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
import { subgraphClients } from '../../config/subgraph';
import {
  ERC20__factory,
  Staking__factory,
  Multicall__factory,
  VestingRegistry__factory,
  GovernorAlpha__factory,
  MassetV3__factory,
} from '../../contracts/types';
import { BaseContractFactory, MulticallProviderType } from '../types';

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

export const supportedNetworksNamesSelector = createSelector(
  supportedNetworksSelector,
  (supportedNetworks) => supportedNetworks.map((item) => chains[item].name)
);

export const wrongNetworkModalSelector = createSelector(
  appState,
  (state) => state.wrongNetworkModal
);

export const walletNotConectedModalSelector = createSelector(
  appState,
  (state) => state.walletNotConectedModal
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

export const subgraphClientSelector = createSelector(
  currentChainSelector,
  (chainConfig) => {
    if (!chainConfig || !subgraphClients[chainConfig.id]) return undefined;

    return subgraphClients[chainConfig.id];
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

export const massetContractSelector = createContractSelector(
  MassetV3__factory,
  'XUSDMassetProxy'
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
  [appState, chainIdSelector, accountSelector],
  (state, chainId, account) => {
    if (
      !chainId ||
      !account ||
      !state.xusdLocalTransactions[chainId] ||
      !state.xusdLocalTransactions[chainId][account]
    ) {
      return;
    }

    return state.xusdLocalTransactions[chainId][account];
  }
);
