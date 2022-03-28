import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { BridgeDictionary } from '../../config/bridges';
import { ChainEnum } from '../../config/chains';
import { pools } from '../../config/pools';
import { tokens } from '../../config/tokens';
import { Reducers } from '../../constants';
import {
  AllowTokens__factory,
  Bridge__factory,
  ERC20__factory,
} from '../../contracts/types';
import { chainIdSelector, providerSelector } from '../app/app.selectors';

const aggregatorState = (state: RootState) => state[Reducers.Aggregator];

export const flowStateSelector = createSelector(
  aggregatorState,
  (state) => state.flowState
);

export const feesAndLimitsStateSelector = createSelector(
  aggregatorState,
  (state) => state.feesAndLimits.state
);

export const feesAndLimitsSelector = createSelector(
  aggregatorState,
  (state) => state.feesAndLimits.data
);

export const poolSelector = createSelector(
  aggregatorState,
  (state) => pools[state.pool]
);

export const startingTokenSelector = createSelector(
  aggregatorState,
  (state) => state.startingToken
);

export const destinationChainSelector = createSelector(
  aggregatorState,
  (state) => state.destinationChain
);

export const destinationTokenSelector = createSelector(
  aggregatorState,
  (state) => state.destinationToken
);

export const bridgeSelector = createSelector(
  [chainIdSelector, destinationChainSelector, flowStateSelector],
  (startingChain, destinationChain, flowState) => {
    if (!startingChain || !destinationChain) {
      return undefined;
    }
    if (flowState === 'deposit') {
      return BridgeDictionary.get(startingChain, destinationChain);
    }
    return BridgeDictionary.get(destinationChain, startingChain);
  }
);

export const startingTokenNameSelector = createSelector(
  [startingTokenSelector],
  (startingToken) => {
    if (!startingToken) {
      return undefined;
    }
    return tokens[startingToken].name;
  }
);

export const startingTokenDecimalsSelector = createSelector(
  [startingTokenSelector, bridgeSelector, flowStateSelector],
  (startingToken, bridge, flowState) => {
    if (!startingToken || !bridge) {
      return undefined;
    }

    return bridge.getTokenDecimals(startingToken, flowState);
  }
);

export const tokenAddressSelector = createSelector(
  [
    startingTokenSelector,
    destinationTokenSelector,
    bridgeSelector,
    flowStateSelector,
  ],
  (startingToken, destinationToken, bridge, flowState) => {
    if (!bridge) {
      return undefined;
    }

    if (flowState === 'deposit') {
      return bridge.tokensAllowed?.find((item) => item.id === startingToken)
        ?.originalAddress;
    }

    return bridge.tokensAllowed?.find((item) => item.id === destinationToken)
      ?.rskSovrynAddress;
  }
);

export const allowTokensAddressSelector = createSelector(
  aggregatorState,
  (state) => state.allowTokensAddress.data
);

export const bridgeContractSelector = createSelector(
  [
    providerSelector,
    chainIdSelector,
    destinationChainSelector,
    bridgeSelector,
    flowStateSelector,
  ],
  (provider, startingChain, destinationChain, bridge, flowState) => {
    if (!provider || !startingChain || !destinationChain || !bridge) {
      return undefined;
    }

    const bridgeAddress =
      flowState === 'deposit' ? bridge.bridgeAddress : bridge.rskBridgeAddress;
    // TODO: remove
    if (!bridgeAddress) {
      return undefined;
    }

    const contract = Bridge__factory.connect(
      bridgeAddress,
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

    return contract;
  }
);

export const startingTokenContractSelector = createSelector(
  [providerSelector, chainIdSelector, startingTokenSelector],
  (provider, startingChain, startingToken) => {
    if (!provider || !startingChain || !startingToken) {
      return undefined;
    }

    // TODO: assert startingChain typeof ChainEnum

    const address = tokens[startingToken].addresses[startingChain as ChainEnum];

    if (!address) {
      return undefined;
    }

    const contract = ERC20__factory.connect(address, provider.getSigner());
    return contract;
  }
);
