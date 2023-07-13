import { BigNumber, utils } from 'ethers';
import { select, call, put, all, takeLatest } from 'typed-redux-saga';
import { TokenEnum } from '../../config/tokens';
import {
  pausedBassetListQuery,
  PausedBassetListQueryItem,
} from '../../queries/pausedBassetListQuery';
import { accountSelector, subgraphClientSelector } from '../app/app.selectors';
import { appActions } from '../app/app.slice';
import {
  allowTokensContractSelector,
  bridgeContractSelector,
  destinationTokenContractSelector,
  bridgeSelector,
  destinationChainSelector,
  destinationTokenAddressSelector,
  flowStateSelector,
  massetAddressSelector,
  sendAmountSelector,
  startingChainSelector,
  startingTokenAddressSelector,
  startingTokenContractSelector,
  startingTokenDecimalsSelector,
  startingTokenSelector,
  tokenAddressSelector,
  destinationTokenSelector,
  feesAndLimitsSelector,
  incentivesSelector,
  incentivesStateSelector,
  feesAndLimitsStateSelector,
  isCrosschainSelector,
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
import { roundBN } from '../utils/utils.math';
import { ChainEnum } from '../../config/chains';
import { getReward, getPenalty } from './getIncentive';

export function* transferTokens(action: AggregatorActions['submit']) {
  const flowState = yield* select(flowStateSelector);

  if (flowState === 'deposit') {
    yield* depositTokens(action);
  } else if (flowState === 'withdraw') {
    yield* withdrawTokens(action);
  }
}

export function* fetchAllowTokenAddress() {
  console.log('fetchAllowTokenAddress');
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
  console.log('fetchBridgeFeesAndLimits');
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
  console.log('fetchStartingTokenBalance');
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

export function* fetchDestinationTokenAggregatorBalance() {
  console.log('fetchDestinationTokenAggregatorBalance');
  try {
    const startingToken = yield* select(startingTokenSelector);
    const massetAddress = yield* select(massetAddressSelector);
    const destinationTokenContract = yield* select(
      destinationTokenContractSelector
    );

    if (startingToken !== TokenEnum.XUSD || !destinationTokenContract) {
      return;
    }

    if (!massetAddress) {
      throw new Error('Could not find masset address');
    }

    yield* put(
      aggregatorActions.fetchDestinationTokenAggregatorBalanceLoading()
    );

    const destinationTokenAggregatorBalance = yield* call(
      destinationTokenContract.balanceOf,
      massetAddress
    );

    yield* put(
      aggregatorActions.setDestinationTokenAggregatorBalance(
        destinationTokenAggregatorBalance.toString()
      )
    );
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : 'Could not fetch destination token aggregator balance';
    yield* put(
      aggregatorActions.fetchDestinationTokenAggregatorBalanceFailure(msg)
    );
  }
}

export function* fetchPausedTokens() {
  console.log('fetchPausedTokens');
  try {
    const subgraphClient = yield* select(subgraphClientSelector);

    if (!subgraphClient) {
      throw new Error('Could not find subgraph client');
    }

    const { bassets } = yield* call(pausedBassetListQuery, subgraphClient);

    const pausedTokens: string[] = bassets.map(
      (item: PausedBassetListQueryItem) => item.id.toLowerCase()
    );

    yield* put(aggregatorActions.setIsStartingTokenPaused(pausedTokens));
  } catch (e) {
    yield* put(aggregatorActions.fetchFeesAndLimitsFailure);
  }
}

// gadi
export function* fetchReceiveAmount() {
  console.log('fetchReceiveAmount');

  const incentiveState = yield* select(incentivesStateSelector);
  const bridgeInfoState = yield* select(feesAndLimitsStateSelector);
  const isCrossChain = yield* select(isCrosschainSelector);

  if(incentiveState !== 'success' || (isCrossChain && bridgeInfoState !== 'success')) {
    yield* put(
      aggregatorActions.setReceiveAmount('')
    );
    return;
  }

  const sendAmount = yield* select(sendAmountSelector);

  if (Number(sendAmount) === 0) {
    yield* put(
      aggregatorActions.setReceiveAmount('0.0')
    );
    return;   
  }

  let receiveAmountBN = utils.parseUnits(sendAmount ?? '0', DEFAULT_ASSET_DECIMALS);

  function subOrZero(bna: BigNumber, bnb: BigNumber): BigNumber {
    return bna.gt(bnb) ? bna.sub(bnb) : BigNumber.from(0);
  }

  if(isCrossChain) {
    const feesAndLimits = yield* select(feesAndLimitsSelector);
    const bridgeFeeBN = BigNumber.from(feesAndLimits.bridgeFee ?? '0');  
    receiveAmountBN = subOrZero(receiveAmountBN, bridgeFeeBN);
  }

  const incentiveData = yield* select(incentivesSelector);
  const incentiveBN = utils.parseUnits(incentiveData.amount ?? '0', DEFAULT_ASSET_DECIMALS);
  const flowState = yield* select(flowStateSelector);
  if (flowState === 'deposit') {
    receiveAmountBN = receiveAmountBN.add(incentiveBN);
  } else if (flowState === 'withdraw') {
    receiveAmountBN = subOrZero(receiveAmountBN, incentiveBN);
  }

  const receiveAmountStr = utils.formatUnits(receiveAmountBN, DEFAULT_ASSET_DECIMALS);

  yield* put(
    aggregatorActions.setReceiveAmount(receiveAmountStr)
  );
}

export function* fetchIncentive() {
  console.log('fetchIncentive');
  try {
    // gadi
    //yield* put(aggregatorActions.setIncentivesLoading());

    const sendAmount = yield* select(sendAmountSelector);
    //if (Number(sendAmount) === 0) return;

    const flowState = yield* select(flowStateSelector);

    const startingTokenAddress = yield* select(startingTokenAddressSelector);
    const destinationTokenAddress = yield* select(
      destinationTokenAddressSelector
    );
    if (!startingTokenAddress || !destinationTokenAddress) return;

    let incentiveBN = BigNumber.from(0);
    let incentiveType = IncentiveType.none;

    if (flowState === 'deposit') {
      const startingToken = yield* select(startingTokenSelector);
      const bridge = yield* select(bridgeSelector);
      const sovTokenAddress = bridge
        ? bridge.getRskSovrynTokenAddress(startingToken!)
        : destinationTokenAddress;

      incentiveType = IncentiveType.reward;
      const tokenDecimals = yield* select(startingTokenDecimalsSelector);
      const amount = utils.parseUnits(sendAmount ?? '', tokenDecimals);
      const destinationChain = yield* select(destinationChainSelector);
      const isMainnet = destinationChain === ChainEnum.RSK;

      incentiveBN = (yield* call(
        getReward,
        sovTokenAddress!,
        amount,
        isMainnet
      )) as BigNumber;
    } else if (flowState === 'withdraw') {
      const destinationToken = yield* select(destinationTokenSelector);
      const bridge = yield* select(bridgeSelector);
      const sovTokenAddress = bridge
        ? bridge.getRskSovrynTokenAddress(destinationToken!)
        : destinationTokenAddress;

      incentiveType = IncentiveType.penalty;
      const amount = utils.parseUnits(sendAmount ?? '', DEFAULT_ASSET_DECIMALS);
      const startingChain = yield* select(startingChainSelector);
      const isMainnet = startingChain === ChainEnum.RSK;

      incentiveBN = (yield* call(
        getPenalty,
        sovTokenAddress!,
        amount,
        isMainnet
      )) as BigNumber;
    }

    yield* put(
      aggregatorActions.setIncentives({
        type: incentiveType,
        amount: utils.formatUnits(incentiveBN, DEFAULT_ASSET_DECIMALS),
      })
    );
  } catch (e) {
    yield* put(aggregatorActions.setIncentivesFailure());
  }
}

export function* resetSendAmount() {
  yield* put(
    aggregatorActions.setSendAmount('0.0')
  );
}

export function* resetAggregator() {
  console.log('resetAggregator');
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
    takeLatest(aggregatorActions.setDestinationChain, fetchAllowTokenAddress),
    takeLatest(aggregatorActions.setDestinationToken, fetchAllowTokenAddress),
    takeLatest(aggregatorActions.setStartingToken, fetchStartingTokenBalance),

    takeLatest(
      aggregatorActions.setDestinationToken,
      fetchDestinationTokenAggregatorBalance
    ),
    takeLatest(
      aggregatorActions.setStartingToken,
      fetchDestinationTokenAggregatorBalance
    ),

    takeLatest(aggregatorActions.setDestinationToken, resetSendAmount),
    takeLatest(aggregatorActions.setStartingToken, resetSendAmount),

    takeLatest(aggregatorActions.setDestinationToken, fetchBridgeFeesAndLimits),

    takeLatest(aggregatorActions.setSendAmount, fetchIncentive),
    takeLatest(aggregatorActions.setDestinationToken, fetchIncentive),
    takeLatest(aggregatorActions.setStartingToken, fetchIncentive),

    takeLatest(aggregatorActions.setFeesAndLimits, fetchReceiveAmount),
    takeLatest(aggregatorActions.setIncentives, fetchReceiveAmount),

    takeLatest(aggregatorActions.submit, transferTokens),
  ]);
}
