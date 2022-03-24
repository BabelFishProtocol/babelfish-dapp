import { select, call, put, all, takeLatest } from 'typed-redux-saga';
import { BridgeDictionary } from '../../config/bridges';
// import { mainnetPool, testnetPool } from '../../config/pools';
import { accountSelector, chainIdSelector } from '../app/app.selectors';
import { appActions } from '../app/app.slice';
import {
  allowTokensContractSelector,
  bridgeContractSelector,
  destinationChainSelector,
  startingTokenContractSelector,
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
    const startingChain = yield* select(chainIdSelector);
    const destinationChain = yield* select(destinationChainSelector);
    const startingToken = yield* select(startingTokenSelector);

    if (!allowTokens || !startingChain || !destinationChain) {
      throw new Error('Not enough data to fetch bridge fees');
    }

    const bridge = BridgeDictionary.get(startingChain, destinationChain);
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
        bridgeFee: bridgeFee.toString(),
        minTransfer: minTransfer.toString(),
        maxTransfer: maxTransfer.toString(),
        dailyLimit: dailyLimit.toString(),
      })
    );
  } catch (e) {
    yield* put(aggregatorActions.fetchFeesAndLimitsFailure());
  }
}

export function* fetchStartingTokenBalance() {
  try {
    const account = yield* select(accountSelector);
    const tokenContract = yield* select(startingTokenContractSelector);

    if (!tokenContract) {
      throw new Error('Could not find token contract');
    }
    if (!account) {
      throw new Error('Please connect wallet first');
    }

    const startingTokenBalance = yield* call(tokenContract.balanceOf, account);
    yield* put(
      aggregatorActions.setStartingTokenBalance(startingTokenBalance.toString())
    );
  } catch (e) {
    yield* put(aggregatorActions.fetchStartingTokenBalanceFailure());
  }
}

export function* aggregatorSaga() {
  yield* all([
    takeLatest(
      aggregatorActions.setStartingToken.type,
      fetchBridgeFeesAndLimits
    ),
    takeLatest(
      aggregatorActions.setAllowTokensAddress,
      fetchBridgeFeesAndLimits
    ),
    takeLatest(aggregatorActions.setDestinationChain, fetchAllowTokenAddress),
    takeLatest(appActions.walletConnected, fetchAllowTokenAddress),
  ]);
}
