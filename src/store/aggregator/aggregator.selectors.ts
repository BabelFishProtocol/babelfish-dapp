import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { BridgeDictionary } from '../../config/bridges';
import { Reducers } from '../../constants';
import { AllowTokens__factory, Bridge__factory } from '../../contracts/types';
import { currentChainSelector, providerSelector } from '../app/app.selectors';

const aggregatorState = (state: RootState) => state[Reducers.Aggregator];

export const flowStateSelector = createSelector(
  aggregatorState,
  (state) => state.flowState
);

export const feesInfoSelector = createSelector(
  aggregatorState,
  (state) => state.feesAndLimits.data
);

export const destinationChainIdSelector = createSelector(
  aggregatorState,
  (state) => state.destinationChainId
);

export const startingTokenSelector = createSelector(
  aggregatorState,
  (state) => state.startingToken
);

export const allowTokensAddressSelector = createSelector(
  aggregatorState,
  (state) => state.allowTokensAddress.data
);

export const bridgeContractSelector = createSelector(
  [providerSelector, currentChainSelector, destinationChainIdSelector],
  (provider, chainFrom, destinationChain) => {
    if (!provider || !chainFrom || !destinationChain) {
      return undefined;
    }
    const bridgeAddress = BridgeDictionary.get(chainFrom.id, destinationChain);

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

// export const allowTokensContractSelector = createSelector(
//   [providerSelector, ], (provider, bridge) => {
//     if(!provider || !bridge) {
//       return undefined
//     }

//     const
//   }
// )
