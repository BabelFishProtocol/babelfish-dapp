import { END, eventChannel } from 'redux-saga';
import { all, call, put, take, takeLatest } from 'typed-redux-saga';
import { Web3Provider } from '@ethersproject/providers';

import { AppActions, appActions } from './app.slice';

function createBlockPollChannel(provider: Web3Provider) {
  return eventChannel<number>((emit) => {
    provider.on('block', (block: number) => {
      emit(block);
    });

    return () => {
      provider.off('block');
      emit(END);
    };
  });
}

function* watchNewBlocks({ payload }: AppActions['walletConnected']) {
  const blockChannel = yield* call(createBlockPollChannel, payload);

  function* closeChannel() {
    blockChannel.close();
  }

  yield* takeLatest(appActions.walletDisconnected.type, closeChannel);

  try {
    while (true) {
      const blockNumber = yield* take(blockChannel);

      yield* put(appActions.setBlockNumber(blockNumber));
    }
  } finally {
    yield* closeChannel();
  }
}

export function* appSaga() {
  yield* all([takeLatest(appActions.walletConnected.type, watchNewBlocks)]);
}
