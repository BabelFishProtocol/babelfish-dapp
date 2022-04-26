import { Web3Provider } from '@ethersproject/providers';
import { Store } from '@reduxjs/toolkit';

import { getStore, RootState } from '..';
import { appActions } from './app.slice';
import {
  chainsInCurrentNetworkSelector,
  currentBlockSelector,
} from './app.selectors';
import { AppState } from './app.state';
import {
  ChainEnum,
  mainnetChainsArr,
  testnetChainsArr,
} from '../../config/chains';

class MockProvider {
  private callback?: (block: number) => void;
  public isRunning: boolean = false;

  trigger(block: number) {
    if (this.callback) {
      this.callback(block);
    }
  }

  on(_: string, callback: () => void) {
    this.isRunning = true;
    this.callback = callback;
  }

  off(_: string) {
    this.isRunning = false;
    this.callback = undefined;
  }
}

describe('app store', () => {
  describe('watchNewBlocks', () => {
    let store: Store<RootState>;
    let mockProvider: MockProvider;

    beforeEach(() => {
      store = { ...getStore() };
      mockProvider = new MockProvider();

      store.dispatch(
        appActions.walletConnected(mockProvider as unknown as Web3Provider)
      );
    });

    it('updates store with new blocks', () => {
      expect(currentBlockSelector(store.getState())).toBe(undefined);

      // simulate that new block was added
      mockProvider.trigger(200);
      expect(currentBlockSelector(store.getState())).toBe(200);

      mockProvider.trigger(400);
      expect(currentBlockSelector(store.getState())).toBe(400);
    });

    it('stops in case wallet is disconnected', () => {
      expect(mockProvider.isRunning).toBe(true);

      mockProvider.trigger(200);

      store.dispatch(appActions.walletDisconnected());

      expect(mockProvider.isRunning).toBe(false);
      expect(currentBlockSelector(store.getState())).toBe(undefined);

      mockProvider.trigger(200);
      // should not sync new blocks when wallet is disconnected
      expect(currentBlockSelector(store.getState())).toBe(undefined);
    });
  });

  describe('chainsInCurrentNetwork', () => {
    it('checks mainnet chains', () => {
      const filledChainId: AppState['chainId'] = ChainEnum.ETH;

      const filledChains =
        chainsInCurrentNetworkSelector.resultFunc(filledChainId);

      expect(filledChains).toEqual(mainnetChainsArr);
    });

    it('checks testnet chains', () => {
      const filledChainId: AppState['chainId'] = ChainEnum.ETH_TESTNET;

      const filledChains =
        chainsInCurrentNetworkSelector.resultFunc(filledChainId);

      expect(filledChains).toEqual(testnetChainsArr);
    });

    it('checks no chainId path', () => {
      const filledChainId: AppState['chainId'] = undefined;

      const filledChains =
        chainsInCurrentNetworkSelector.resultFunc(filledChainId);

      expect(filledChains).toEqual(undefined);
    });
  });
});
