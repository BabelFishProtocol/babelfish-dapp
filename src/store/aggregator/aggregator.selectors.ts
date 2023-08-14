import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { BridgeDictionary } from '../../config/bridges';
import { ChainEnum } from '../../config/chains';
import { contractsAddresses } from '../../config/contracts';
import { pools } from '../../config/pools';
import { TokenEnum, tokens } from '../../config/tokens';
import { DEFAULT_ASSET_DECIMALS, Reducers } from '../../constants';
import {
  AllowTokens__factory,
  Bridge__factory,
  ERC20__factory,
  MassetV4__factory,
} from '../../contracts/types';
import {
  chainIdSelector,
  providerSelector,
  testnetMainnetSelector,
} from '../app/app.selectors';
import { selectCurrentCallStepData } from '../utils/utils.selectors';

const aggregatorState = (state: RootState) => state[Reducers.Convert];

export const flowStateSelector = createSelector(aggregatorState, (state) =>
  state.startingToken === TokenEnum.XUSD ? 'withdraw' : 'deposit'
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

export const pausedTokensSelector = createSelector(
  aggregatorState,
  (state) => state.pausedTokens
);

export const destinationChainSelector = createSelector(
  aggregatorState,
  (state) => state.destinationChain
);

export const destinationTokenSelector = createSelector(
  aggregatorState,
  (state) => state.destinationToken
);

export const startingTokenBalanceSelector = createSelector(
  aggregatorState,
  (state) => state.startingTokenBalance.data
);
export const startingTokenBalanceStateSelector = createSelector(
  aggregatorState,
  (state) => state.startingTokenBalance.state
);

export const destinationTokenAggregatorBalanceSelector = createSelector(
  aggregatorState,
  (state) => state.destinationTokenAggregatorBalance.data
);
export const destinationTokenAggregatorBalanceStateSelector = createSelector(
  aggregatorState,
  (state) => state.destinationTokenAggregatorBalance.state
);

export const sendAmountSelector = createSelector(
  aggregatorState,
  (state) => state.sendAmount
);

export const incentivesStateSelector = createSelector(
  aggregatorState,
  (state) => state.incentives.state
);

export const incentivesSelector = createSelector(
  aggregatorState,
  (state) => state.incentives.data
);

export const receiveAmountSelector = createSelector(
  aggregatorState,
  (state) => state.receiveAmount
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
      return DEFAULT_ASSET_DECIMALS;
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
    if (!bridge || !startingToken || !destinationToken) {
      return undefined;
    }

    if (flowState === 'deposit') {
      return bridge.getOriginalTokenAddress(startingToken);
    }
    return bridge.getRskSovrynTokenAddress(destinationToken);
  }
);

export const allowTokensAddressSelector = createSelector(
  aggregatorState,
  (state) => state.allowTokensAddress.data
);

export const massetAddressSelector = createSelector(
  [testnetMainnetSelector, chainIdSelector, destinationChainSelector],
  (testnetMainnetFlag, startingChain, destinationChain) => {
    if (!testnetMainnetFlag || !startingChain || !destinationChain)
      return undefined;

    if (testnetMainnetFlag === 'mainnet') {
      return contractsAddresses[ChainEnum.RSK].XUSDMassetProxy;
    }
    if (testnetMainnetFlag === 'testnet') {
      return contractsAddresses[ChainEnum.RSK_TESTNET].XUSDMassetProxy;
    }

    return undefined;
  }
);

export const massetContractSelector = createSelector(
  [massetAddressSelector, providerSelector],
  (massetAddress, provider) => {
    if (!massetAddress || !provider) {
      return undefined;
    }

    const contract = MassetV4__factory.connect(
      massetAddress,
      provider?.getSigner()
    );

    return contract;
  }
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

export const startingChainSelector = createSelector(
  aggregatorState,
  (state) => {
    return state.startingChain;
  }
);

export const startingTokenAddressSelector = createSelector(
  [startingChainSelector, startingTokenSelector],
  (startingChain, startingToken) => {
    if (!startingChain || !startingToken) {
      return undefined;
    }
    const address = tokens[startingToken].addresses[startingChain];

    return address;
  }
);

export const startingTokenContractSelector = createSelector(
  [providerSelector, startingTokenAddressSelector],
  (provider, startingTokenAddress) => {
    if (!provider || !startingTokenAddress) {
      return undefined;
    }

    const contract = ERC20__factory.connect(
      startingTokenAddress.toLowerCase(),
      provider.getSigner()
    );
    return contract;
  }
);

/** Original destination token selector
 ** for 'deposit' flowState: XUSD
 ** for 'withdraw' flowState through bridge: DAI, USDT, ..
 ** for 'withdraw' flowState on RSK: BDUS, RDOC, ...
 */
export const destinationTokenAddressSelector = createSelector(
  [destinationChainSelector, destinationTokenSelector],
  (destinationChain, destinationToken) => {
    if (!destinationChain || !destinationToken) {
      return undefined;
    }
    const address = tokens[destinationToken].addresses[destinationChain];

    return address;
  }
);

export const isEnoughTokensSelector = createSelector(
  [feesAndLimitsSelector, startingTokenBalanceSelector],
  (feesAndLimits, startingTokenBalance) => {
    if (!feesAndLimits.minTransfer || !startingTokenBalance) {
      return undefined;
    }
    return feesAndLimits.minTransfer >= startingTokenBalance;
  }
);

/**
 * Pool token selector e.g. DAIes, USDCbs
 ** NOTE: Don't use for native rsk tokens e.g BDUS, ZUSD
 */
export const bassetAddressSelector = createSelector(
  [bridgeSelector, destinationTokenSelector],
  (bridge, destinationToken) => {
    if (!bridge || !destinationToken) {
      return undefined;
    }
    return bridge.getRskSovrynTokenAddress(destinationToken)?.toLowerCase();
  }
);

export const startingTokenBridgeAddressSelector = createSelector(
  [bridgeSelector, startingTokenSelector],
  (bridge, startingToken) => {
    if (!bridge || !startingToken) {
      return undefined;
    }
    return bridge.getRskSovrynTokenAddress(startingToken)?.toLowerCase();
  }
);

export const isCrosschainSelector = createSelector(
  [chainIdSelector, destinationChainSelector], 
  (startingChain, destinationChain) => startingChain !== destinationChain);

export const destinationTokenContractSelector = createSelector(
  [
    providerSelector,
    chainIdSelector,
    destinationChainSelector,
    bassetAddressSelector,
    destinationTokenAddressSelector,
  ],
  (
    provider,
    startingChain,
    destinationChain,
    bridgeTokenAddress,
    rskTokenAddress
  ) => {
    if (
      !provider ||
      !startingChain ||
      !destinationChain ||
      (!bridgeTokenAddress && !rskTokenAddress)
    ) {
      return undefined;
    }

    const isCrossChain = startingChain !== destinationChain;

    const destinationTokenAddress = isCrossChain
      ? bridgeTokenAddress
      : rskTokenAddress;

    const contract = ERC20__factory.connect(
      destinationTokenAddress!.toLowerCase(),
      provider.getSigner()
    );
    return contract;
  }
);

const callSelector = createSelector(
  aggregatorState,
  (state) => state.submitCall
);

export const submitAggregatorStatusSelector = createSelector(
  callSelector,
  (state) => selectCurrentCallStepData(state)
);

export const submitCallCurrentOperation = createSelector(
  callSelector,
  (state) => state.currentOperation
);

export const submitTxDetails = createSelector(
  aggregatorState,
  (state) => state.txDetails
);
