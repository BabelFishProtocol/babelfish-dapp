import { utils } from 'ethers';
import { call, put, select } from 'typed-redux-saga';
import { createWatcherSaga } from '../../utils';
import {
  bridgeContractSelector,
  massetAddressSelector,
  startingTokenAddressSelector,
} from '../aggregator.selectors';
import { AggregatorActions, aggregatorActions } from '../aggregator.slice';

// Just DEPOSIT the basset into masset now
export function* transferTokens({
  payload,
}: AggregatorActions['startTokenTransfer']) {
  const amount = payload.SendAmount;
  const receiver = payload.ReceiveAddress;
  const extraData = utils.defaultAbiCoder.encode(['address'], [receiver]);

  try {
    const bridge = yield* select(bridgeContractSelector);
    const tokenAddress = yield* select(startingTokenAddressSelector);
    const massetAddress = yield* select(massetAddressSelector);
    if (!bridge) {
      throw new Error('Could not connect to bridge');
    }
    if (!tokenAddress || !massetAddress) {
      throw new Error('Could not find token address');
    }

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
