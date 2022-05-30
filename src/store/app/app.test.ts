import { Web3Provider } from '@ethersproject/providers';
import { Store } from '@reduxjs/toolkit';

import { getStore, RootState } from '..';
import { appActions, appReducer } from './app.slice';
import {
  chainsInCurrentNetworkSelector,
  currentBlockSelector,
  testnetMainnetSelector,
} from './app.selectors';
import { AppState } from './app.state';
import {
  ChainEnum,
  mainnetChainsArr,
  testnetChainsArr,
} from '../../config/chains';
import { XusdLocalTransaction } from '../aggregator/aggregator.state';

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
      const filledChains = chainsInCurrentNetworkSelector.resultFunc('mainnet');
      expect(filledChains).toEqual(mainnetChainsArr);
    });

    it('checks testnet chains', () => {
      const filledChains = chainsInCurrentNetworkSelector.resultFunc('testnet');
      expect(filledChains).toEqual(testnetChainsArr);
    });

    it('checks no chainId path', () => {
      const filledChains = chainsInCurrentNetworkSelector.resultFunc(undefined);
      expect(filledChains).toEqual([]);
    });
  });

  describe('isOnTestnetSelector ', () => {
    it('checks that testnet is detected', () => {
      const filledChainId: AppState['chainId'] = ChainEnum.ETH_TESTNET;

      const filledTestnetDetect =
        testnetMainnetSelector.resultFunc(filledChainId);

      expect(filledTestnetDetect).toEqual('testnet');
    });

    it('checks that testnet is not detected', () => {
      const filledChainId: AppState['chainId'] = ChainEnum.ETH;

      const filledTestnetDetect =
        testnetMainnetSelector.resultFunc(filledChainId);

      expect(filledTestnetDetect).toEqual('mainnet');
    });
  });

  describe('localXusdTransactions', () => {
    const mockAccount = '0x0';

    const localXusdTransaction: XusdLocalTransaction = {
      txHash: '0x4',
      asset: 'XUSD',
      date: '1653905641',
      amount: '7534',
      user: '0x6d66',
      event: 'Withdraw',
      status: 'Pending',
    };

    const getSuccessState = (state: AppState): AppState => ({
      ...state,
      xusdLocalTransactions: {
        [ChainEnum.ETH]: {
          [mockAccount]: [localXusdTransaction],
        },
      },
    });

    const action = appActions.setLocalXusdTransactions(localXusdTransaction);

    const checkReducerState = (initialState: AppState) => {
      expect(appReducer(initialState, action)).toEqual(
        getSuccessState(initialState)
      );
    };

    it('sets proper local tx with already declared chainId and account', async () => {
      const initialWithChainIdAndAddress: AppState = {
        ...new AppState(),
        chainId: ChainEnum.ETH,
        account: mockAccount,
        xusdLocalTransactions: {
          [ChainEnum.ETH]: {
            [mockAccount]: [],
          },
        },
      };

      checkReducerState(initialWithChainIdAndAddress);
    });

    it('sets local tx without account declared', async () => {
      const initialWithChainId: AppState = {
        ...new AppState(),
        chainId: ChainEnum.ETH,
        account: mockAccount,
        xusdLocalTransactions: {
          [ChainEnum.ETH]: {},
        },
      };

      checkReducerState(initialWithChainId);
    });

    it('sets local tx without account and chain declared', async () => {
      const initialWithoutChainIdOrAddress: AppState = {
        ...new AppState(),
        chainId: ChainEnum.ETH,
        account: mockAccount,
        xusdLocalTransactions: {},
      };

      checkReducerState(initialWithoutChainIdOrAddress);
    });
  });
});
