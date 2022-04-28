import { utils } from 'ethers';
import { call, put, select } from 'typed-redux-saga';
import { massetContractSelector } from '../../app/app.selectors';
import { createWatcherSaga } from '../../utils/utils.sagas';
import {
  bassetAddressSelector,
  bridgeContractSelector,
  flowStateSelector,
  massetAddressSelector,
  startingTokenAddressSelector,
  startingTokenContractSelector,
  startingTokenDecimalsSelector,
} from '../aggregator.selectors';
import { AggregatorActions, aggregatorActions } from '../aggregator.slice';

// Just DEPOSIT the basset into masset now
export function* depositTokens({
  payload,
}: AggregatorActions['startTokenTransfer']) {
  try {
    const bridge = yield* select(bridgeContractSelector);
    const tokenAddress = yield* select(startingTokenAddressSelector);
    const tokenDecimals = yield* select(startingTokenDecimalsSelector);
    const tokenContract = yield* select(startingTokenContractSelector);
    const massetAddress = yield* select(massetAddressSelector);

    if (!tokenContract || !bridge) {
      throw new Error('Could not find contracts');
    }
    if (!tokenAddress || !massetAddress || !tokenDecimals) {
      throw new Error('Could not find token address');
    }

    const amount = utils.parseUnits(payload.SendAmount, tokenDecimals);
    const receiver = payload.ReceiveAddress;
    const extraData = utils.defaultAbiCoder.encode(['address'], [receiver]);

    const approve = yield* call(tokenContract.approve, bridge.address, amount);
    yield* call(approve.wait);

    const tx = yield* call(
      bridge.receiveTokensAt,
      tokenAddress,
      amount,
      massetAddress,
      extraData
    );

    yield* call(tx.wait);
    yield* put(aggregatorActions.transferTokensSuccess());
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : 'There was some error in transferring tokens. Please try again';
    yield* put(aggregatorActions.transferTokensFailure(msg));
  }
}

export function* withdrawTokens({
  payload,
}: AggregatorActions['startTokenTransfer']) {
  try {
    const tokenDecimals = yield* select(startingTokenDecimalsSelector);
    const tokenContract = yield* select(startingTokenContractSelector);

    const bassetAddress = yield* select(bassetAddressSelector);

    const massetContract = yield* select(massetContractSelector);
    if (!massetContract || !tokenContract) {
      throw new Error('Could not find contracts');
    }
    if (!bassetAddress) {
      throw new Error('Could not find basset address');
    }

    const amount = utils.parseUnits(payload.SendAmount, tokenDecimals);
    const receiver = payload.ReceiveAddress;

    const approve = yield* call(
      tokenContract.approve,
      massetContract.address,
      amount
    );
    yield* call(approve.wait);

    const tx = yield* call(
      massetContract['redeemToBridge(address,uint256,address)'],
      bassetAddress,
      amount,
      receiver
    );

    yield* call(tx.wait);

    yield* put(aggregatorActions.transferTokensSuccess());
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : 'There was some error in transferring tokens. Please try again';
    yield* put(aggregatorActions.transferTokensFailure(msg));
  }
}

export function* transferTokens({
  payload,
  type,
}: AggregatorActions['startTokenTransfer']) {
  const flowState = yield* select(flowStateSelector);

  if (flowState === 'deposit') {
    yield* depositTokens({ payload, type });
  } else if (flowState === 'withdraw') {
    yield* withdrawTokens({ payload, type });
  }
}

function* triggerFetch() {
  yield* put(aggregatorActions.checkTransferTokens());
}

function* triggerUpdate() {
  yield* put(aggregatorActions.checkTransferTokens());
}

export const watchTransferTokens = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: aggregatorActions.stopWatchingTransferTokens.type,
});
