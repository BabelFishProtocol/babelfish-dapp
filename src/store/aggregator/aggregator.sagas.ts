import { select, call, put, all, takeLatest } from 'typed-redux-saga';
import { getCurrentTimestamp } from '../../utils/helpers';
import { accountSelector } from '../app/app.selectors';
import { appActions } from '../app/app.slice';
import {
  allowTokensContractSelector,
  bridgeContractSelector,
  flowStateSelector,
  startingTokenContractSelector,
  startingTokenSelector,
  submitCallCurrentOperation,
  submitTxDetails,
  tokenAddressSelector,
} from './aggregator.selectors';
import { AggregatorActions, aggregatorActions } from './aggregator.slice';
import { XusdLocalTransaction } from './aggregator.state';
import { depositTokens } from './sagas/depositTokens';
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

export function* setLocalTx(tx: XusdLocalTransaction) {
  yield* put(appActions.setLocalXusdTransactions(tx));
}

export function* addTransactionIntoLocalStorage({
  payload,
}: AggregatorActions['setSubmitStepData']) {
  const currentOperation = yield* select(submitCallCurrentOperation);
  const txDetails = yield* select(submitTxDetails);

  let txToSave: XusdLocalTransaction;
  const now = getCurrentTimestamp().toString();

  if (
    currentOperation === 'deposit' &&
    payload.txReceipt &&
    txDetails?.isCrossChain
  ) {
    txToSave = {
      ...txDetails,
      txHash: payload.txReceipt.transactionHash,
      asset: 'XUSD',
      status: 'Confirmed',
      date: now,
    };

    setLocalTx(txToSave);
    return;
  }

  if (
    (currentOperation !== 'deposit' && currentOperation !== 'withdraw') ||
    !payload.tx ||
    !txDetails
  ) {
    return;
  }

  txToSave = {
    txHash: payload.tx.hash,
    asset: 'XUSD',
    date: now,
    ...txDetails,
  };

  setLocalTx(txToSave);
}

export function* setErrorOnDepositCrossChainTx() {
  const currentOperation = yield* select(submitCallCurrentOperation);
  const txDetails = yield* select(submitTxDetails);

  if (currentOperation === 'deposit' && txDetails?.isCrossChain) {
    setLocalTx({
      ...txDetails,
      status: 'Failed',
      txHash: '0x0',
      asset: 'XUSD',
      date: getCurrentTimestamp().toString(),
    });
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
    takeLatest(aggregatorActions.setSubmitError, setErrorOnDepositCrossChainTx),

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
    takeLatest(aggregatorActions.setStartingToken, fetchStartingTokenBalance),

    takeLatest(aggregatorActions.submit, transferTokens),
  ]);
}
