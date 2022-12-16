import { select, call, put, all, takeLatest } from 'typed-redux-saga';
import { accountSelector, pauseManagerSelector } from '../app/app.selectors';
import { appActions } from '../app/app.slice';
import {
  allowTokensContractSelector,
  bridgeContractSelector,
  flowStateSelector,
  startingTokenAddressSelector,
  startingTokenContractSelector,
  startingTokenSelector,
  tokenAddressSelector,
} from './aggregator.selectors';
import { AggregatorActions, aggregatorActions } from './aggregator.slice';
import { depositTokens } from './sagas/depositTokens';
import {
  addTransactionIntoLocalStorage,
  setFailedOnDepositCrossChainTx,
} from './sagas/localTransactions';
import { withdrawTokens } from './sagas/withdrawTokens';

export function* transferTokens(action: AggregatorActions['submit']) {
  const flowState = yield* select(flowStateSelector);

  if (flowState === 'deposit') {
    yield* depositTokens(action);
  } else if (flowState === 'withdraw') {
    yield* withdrawTokens(action);
  }
}

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
    yield* put(aggregatorActions.fetchFeesAndLimitsLoading());
    const allowTokens = yield* select(allowTokensContractSelector);
    const startingToken = yield* select(startingTokenSelector);
    const tokenAddress = yield* select(tokenAddressSelector);

    if (!allowTokens || !startingToken || !tokenAddress) {
      throw new Error('Not enough data to fetch bridge fees');
    }

    const bridgeFee = yield* call(
      allowTokens.getFeePerToken,
      tokenAddress.toLowerCase()
    );
    const minTransfer = yield* call(
      allowTokens.getMinPerToken,
      tokenAddress.toLowerCase()
    );
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
    const msg =
      e instanceof Error
        ? e.message
        : 'There was some error in fetching fees and limits. Please try again';
    yield* put(aggregatorActions.fetchFeesAndLimitsFailure(msg));
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
    yield* put(aggregatorActions.fetchStartingTokenBalanceLoading());

    const startingTokenBalance = yield* call(tokenContract.balanceOf, account);
    yield* put(
      aggregatorActions.setStartingTokenBalance(startingTokenBalance.toString())
    );
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : 'Could not fetch starting token balance';
    yield* put(aggregatorActions.fetchStartingTokenBalanceFailure(msg));
  }
}

export function* fetchDepositPauseInfo() {
  try {
    yield* put(aggregatorActions.setIsStartingTokenPaused(false));

    const token = yield* select(startingTokenAddressSelector);
    const pauseManager = yield* select(pauseManagerSelector);

    if (!token) {
      throw new Error('Could not find starting token contract');
    }

    if (!pauseManager) {
      throw new Error('Could not find PauseManager contract');
    }

    const isTokenPaused = yield* call(
      pauseManager.isPaused,
      token.toLowerCase()
    );

    yield* put(aggregatorActions.setIsStartingTokenPaused(isTokenPaused));
  } catch {
    yield* put(aggregatorActions.setIsStartingTokenPaused(false));
  }
}

export function* resetAggregator() {
  yield* put(aggregatorActions.resetAggregator());
}

export function* aggregatorSaga() {
  yield* all([
    takeLatest(appActions.walletConnected, resetAggregator),
    takeLatest(
      aggregatorActions.setSubmitStepData,
      addTransactionIntoLocalStorage
    ),
    takeLatest(
      aggregatorActions.setSubmitError,
      setFailedOnDepositCrossChainTx
    ),

    takeLatest(aggregatorActions.setStartingToken.type, fetchAllowTokenAddress),
    takeLatest(
      aggregatorActions.setStartingToken.type,
      fetchBridgeFeesAndLimits
    ),
    takeLatest(
      aggregatorActions.setAllowTokensAddress,
      fetchBridgeFeesAndLimits
    ),
    takeLatest(aggregatorActions.setDestinationToken, fetchBridgeFeesAndLimits),

    takeLatest(aggregatorActions.setDestinationChain, fetchAllowTokenAddress),
    takeLatest(aggregatorActions.setDestinationToken, fetchAllowTokenAddress),
    takeLatest(aggregatorActions.setStartingToken, fetchDepositPauseInfo),
    takeLatest(aggregatorActions.setStartingToken.type, fetchDepositPauseInfo),
    takeLatest(aggregatorActions.setStartingToken, fetchStartingTokenBalance),

    takeLatest(aggregatorActions.submit, transferTokens),
  ]);
}
