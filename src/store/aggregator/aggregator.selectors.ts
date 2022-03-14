import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { BridgeDictionary } from '../../config/bridges';
import { ChainEnum } from '../../config/chains';
import { Reducers } from '../../constants';
import { AllowTokens__factory, Bridge__factory } from '../../contracts/types';
import { currentChainSelector, providerSelector } from '../app/app.selectors';

const aggregatorState = (state: RootState) => state[Reducers.Aggregator];

export const feesInfoSelector = createSelector(
  aggregatorState,
  (state) => state.feesAndLimits.data
);

export const chainToSelector = createSelector(
  aggregatorState,
  (state) => state.chainTo
);

export const allowTokensAddressSelector = createSelector(
  aggregatorState,
  (state) => state.allowTokensAddress.data
);

export const bridgeContractSelector = createSelector(
  [providerSelector, currentChainSelector, chainToSelector],
  (provider, chainFrom, chainTo) => {
    if (!provider || !chainFrom || !chainTo) {
      return undefined;
    }
    const bridgeAddress = BridgeDictionary.get(chainFrom.id, chainTo.id);

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
    return contract;
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
