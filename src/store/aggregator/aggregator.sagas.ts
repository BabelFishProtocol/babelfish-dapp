import { BigNumber, utils } from 'ethers';
import { select, call, put, all, takeLatest } from 'typed-redux-saga';
import { accountSelector, pauseManagerSelector, rewardManagerSelector } from '../app/app.selectors';
import { appActions } from '../app/app.slice';
import {
  allowTokensContractSelector,
  bridgeContractSelector,
  destinationTokenAddressSelector,
  flowStateSelector,
  sendAmountSelector,
  startingTokenAddressSelector,
  startingTokenContractSelector,
  startingTokenDecimalsSelector,
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
import { DEFAULT_ASSET_DECIMALS } from '../../constants';
import { IncentiveType } from './aggregator.state';

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

export function* fetchPausedTokens() {
  try {
    const pauseManager = yield* select(pauseManagerSelector);

    if (!pauseManager) {
      throw new Error('Could not find PauseManager contract');
    }

    const pausedTokens = yield* call(pauseManager.getTokens);

    yield* put(aggregatorActions.setIsStartingTokenPaused(pausedTokens));
  } catch (e) {
    // console.error(e);
  }
}

export function* fetchIncentive() {
  try {

    yield* put(aggregatorActions.fetchIncentivesLoading());

    const rewardManager = yield* select(rewardManagerSelector);
    const sendAmount = yield* select(sendAmountSelector);
    const flowState = yield* select(flowStateSelector);

    if (!rewardManager) {
      throw new Error('Could not find RewardManager contract');
    }

    const startingTokenAddress = (yield* select(startingTokenAddressSelector)) ?? '';
    const destinationTokenAddress = (yield* select(destinationTokenAddressSelector)) ?? '';

    let incentive = BigNumber.from(0);
    let receiveAmount = BigNumber.from(0);
    let incentiveType = IncentiveType.none;

    if(flowState === 'deposit' && startingTokenAddress) {

      incentiveType = IncentiveType.reward;
      const tokenDecimals = yield* select(startingTokenDecimalsSelector);
      const amount = utils.parseUnits(sendAmount, tokenDecimals);
      incentive = yield* call(rewardManager.getRewardForDeposit,
        startingTokenAddress.toLowerCase(), amount);
      incentive = roundBN(incentive, 3);
      receiveAmount = amount.add(incentive);

    } else if (flowState === 'withdraw' && destinationTokenAddress) {

      incentiveType = IncentiveType.penalty;
      const tokenDecimals = DEFAULT_ASSET_DECIMALS;
      const amount = utils.parseUnits(sendAmount, tokenDecimals);
      incentive = yield* call(rewardManager.getPenaltyForWithdrawal,
        destinationTokenAddress.toLowerCase(), amount);
      incentive = roundBN(incentive, 3);
      receiveAmount = amount.sub(incentive);

    }

    yield* put(aggregatorActions.setIncentives({ 
      type: incentiveType, 
      amount: utils.formatUnits(incentive, DEFAULT_ASSET_DECIMALS) }));
    yield* put(aggregatorActions.setReceiveAmount(utils.formatUnits(receiveAmount, DEFAULT_ASSET_DECIMALS)));

  } catch (e) {
    const msg =
    e instanceof Error
      ? e.message
      : 'There was some error in fetching the incentive amount. Please try again';    
    yield* put(aggregatorActions.fetchIncentivesFailure(msg));
  }
}

export function* resetAggregator() {
  yield* put(aggregatorActions.resetAggregator());
}

export function* aggregatorSaga() {
  yield* all([
    takeLatest(appActions.walletConnected, resetAggregator),
    takeLatest(appActions.walletConnected, fetchPausedTokens),
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
    takeLatest(aggregatorActions.setStartingToken, fetchStartingTokenBalance),

    takeLatest(aggregatorActions.setSendAmount, fetchIncentive),
    takeLatest(aggregatorActions.setDestinationToken, fetchIncentive),

    takeLatest(aggregatorActions.submit, transferTokens),
  ]);
}

function roundBN(bn: BigNumber, digits: number): BigNumber {
  const ten = BigNumber.from('10');
  const da = ten.pow(18 - digits);
  return bn.div(da).mul(da);
}
