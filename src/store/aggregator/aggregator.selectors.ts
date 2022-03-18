import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { BridgeDictionary } from '../../config/bridges';
import { tokens } from '../../config/tokens';
import { Reducers } from '../../constants';
import {
  AllowTokens__factory,
  Bridge__factory,
  ERC20__factory,
} from '../../contracts/types';
import { providerSelector } from '../app/app.selectors';

const aggregatorState = (state: RootState) => state[Reducers.Aggregator];

export const flowStateSelector = createSelector(
  aggregatorState,
  (state) => state.flowState
);

export const feesInfoSelector = createSelector(
  aggregatorState,
  (state) => state.feesAndLimits.data
);

export const startingTokenSelector = createSelector(
  aggregatorState,
  (state) => state.startingToken
);

export const startingChainSelector = createSelector(
  aggregatorState,
  (state) => state.startingChain
);

export const destinationChainSelector = createSelector(
  aggregatorState,
  (state) => state.destinationChain
);

export const wrongChainConnectedErrorSelector = createSelector(
  aggregatorState,
  (state) => state.wrongChainConnectedError
);

export const allowTokensAddressSelector = createSelector(
  aggregatorState,
  (state) => state.allowTokensAddress.data
);

export const bridgeContractSelector = createSelector(
  [providerSelector, startingChainSelector, destinationChainSelector],
  (provider, startingChain, destinationChain) => {
    if (!provider || !startingChain || !destinationChain) {
      return undefined;
    }
    const bridgeAddress = BridgeDictionary.get(startingChain, destinationChain);

    if (!bridgeAddress) {
      return undefined;
    }
    const contract = Bridge__factory.connect(
      bridgeAddress.bridgeAddress,
      provider.getSigner()
    );
    return contract;
  }
);

export const allowTokensContractSelector = createSelector(
  [providerSelector, allowTokensAddressSelector],
  (provider, allowTokensAddress) => {
    if (!provider || !allowTokensAddress) {
      return undefined;
    }
    const contract = AllowTokens__factory.connect(
      allowTokensAddress,
      provider.getSigner()
    );

    return contract as ReturnType<typeof AllowTokens__factory['connect']>;
  }
);

export const erc20TokenContractSelector = createSelector(
  [providerSelector, startingChainSelector, startingTokenSelector],
  (provider, startingChain, startingToken) => {
    if (!provider || !startingChain || !startingToken) {
      return undefined;
    }

    const address = tokens[startingToken].addresses[startingChain];

    if (!address) {
      return undefined;
    }

    const contract = ERC20__factory.connect(address, provider.getSigner());
    return contract as ReturnType<typeof ERC20__factory['connect']>;
  }
);
