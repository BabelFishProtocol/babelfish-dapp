import { select, call, put, all, takeLatest } from 'typed-redux-saga';
import { BridgeDictionary } from '../../config/bridges';
import { mainnetPool, testnetPool } from '../../config/pools';
import { currentChainSelector } from '../app/app.selectors';
import { appActions } from '../app/app.slice';
import {
  allowTokensContractSelector,
  bridgeContractSelector,
  destinationChainIdSelector,
  startingTokenSelector,
} from './aggregator.selectors';
import { aggregatorActions } from './aggregator.slice';

export function* fetchAllowTokenAddress() {
  try {
    const bridge = yield* select(bridgeContractSelector);

    if (!bridge) {
      throw new Error('Could not connect to bridge');
    }

    const allowTokensAddress = yield* call(bridge.allowTokens);

    yield* put(aggregatorActions.setAllowTokensAddress(allowTokensAddress));
  } catch (e) {
    yield* put(aggregatorActions.fetchAllowTokensAddressFailure());
  }
}

export function* fetchBridgeFeesAndLimits() {
  try {
    const allowTokens = yield* select(allowTokensContractSelector);
    const currentChain = yield* select(currentChainSelector);
    const destinationChainId = yield* select(destinationChainIdSelector);
    const startingToken = yield* select(startingTokenSelector);

    if (!allowTokens || !currentChain || !destinationChainId) {
      throw new Error('Not enough data to fetch bridge fees');
    }

    const bridge = BridgeDictionary.get(currentChain.id, destinationChainId);
    const tokenAddress = bridge?.tokensAllowed?.find(
      (item) => item.id === startingToken
    )?.originalAddress;

    if (!tokenAddress) {
      throw new Error('Token address not found');
    }

    const bridgeFee = yield* call(allowTokens.getFeePerToken, tokenAddress);
    const minTransfer = yield* call(allowTokens.getMinPerToken, tokenAddress);
    const maxTransfer = yield* call(allowTokens.getMaxTokensAllowed);
    const dailyLimit = yield* call(allowTokens.dailyLimit);

    yield* put(
      aggregatorActions.setFeesAndLimits({
        bridgeFee,
        minTransfer,
        maxTransfer,
        dailyLimit,
      })
    );
  } catch (e) {
    yield* put(aggregatorActions.fetchFeesAndLimitsFailure());
  }
}

export function* setFlowState() {
  const currentChain = yield* select(currentChainSelector);

  // TODO enable mainnet
  if (
    currentChain?.id === testnetPool.masterChain.id ||
    currentChain?.id === mainnetPool.masterChain.id
  ) {
    yield* put(aggregatorActions.setFlowStateWithdraw());
  } else {
    yield* put(aggregatorActions.setFlowStateDeposit());
  }
}

export function* aggregatorSaga() {
  yield* all([
    takeLatest(appActions.setChainId, setFlowState),
    takeLatest(appActions.walletConnected, fetchAllowTokenAddress),
    takeLatest(
      aggregatorActions.setStartingToken.type,
      fetchBridgeFeesAndLimits
    ),
    takeLatest(
      aggregatorActions.setAllowTokensAddress,
      fetchBridgeFeesAndLimits
    ),
    takeLatest(aggregatorActions.setDestinationChain, fetchAllowTokenAddress),
  ]);
}
