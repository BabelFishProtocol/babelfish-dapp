import { select, call, put } from 'typed-redux-saga';
import { bridgeContractSelector } from './aggregator.selectors';
import { aggregatorActions } from './aggregator.slice';

export function* fetchBridgeData() {
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

// export function* fetchBridgeFees() {
//   try {
//     const
//     const allowTokens = yield* select(allowTokensContractSelector);
//     if(!allowTokens) {
//       throw new Error('Could not connect to bridge')
//     }
//     const fee = yield* call(allowTokens.getFeePerToken, token)
//   }
// }
