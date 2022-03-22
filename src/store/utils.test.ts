import { CaseReducerActions, createSlice, Store } from '@reduxjs/toolkit';
import { call, takeLatest } from 'typed-redux-saga';

import { getStore, rootReducer } from '.';
import { Reducers } from '../constants';
import { mockProvider } from '../testUtils';
import { appActions, appReducer } from './app/app.slice';
import { indexSaga } from './saga';
import { createWatcherSaga } from './utils';

const mockReducers = {
  watch: () => {},
  stopWatching: () => {},
};

const createMockStore = () => {
  const mockSliceName = 'watchTest';
  const mockSlice = createSlice({
    name: 'watchTest',
    initialState: {},
    reducers: mockReducers,
  });

  const { actions: mockActions, reducer: mockReducer } = mockSlice;

  const mockRootReducer = {
    [mockSliceName]: mockReducer,
    [Reducers.App]: appReducer,
  };

  const mockFetch = jest.fn();
  function* mockFetchSaga() {
    yield* call(mockFetch);
  }

  const mockUpdate = jest.fn();
  function* mockUpdateSaga() {
    yield* call(mockUpdate);
  }

  const mockWatcher = createWatcherSaga({
    fetchSaga: mockFetchSaga,
    updateSaga: mockUpdateSaga,
    stopAction: mockActions.stopWatching.type,
  });

  function* mockIndexSaga() {
    yield* takeLatest(mockActions.watch.type, mockWatcher);
  }

  const store = {
    ...getStore(
      mockIndexSaga as typeof indexSaga,
      mockRootReducer as unknown as typeof rootReducer
    ),
  };

  return {
    store,
    mockFetch,
    mockUpdate,
    mockActions,
  };
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('saga utils', () => {
  describe('createWatcherSaga', () => {
    let store: Store;
    let mockFetch: jest.Mock;
    let mockUpdate: jest.Mock;
    let mockActions: CaseReducerActions<typeof mockReducers>;

    beforeEach(() => {
      const created = createMockStore();

      store = created.store;
      mockFetch = created.mockFetch;
      mockUpdate = created.mockUpdate;
      mockActions = created.mockActions;
    });

    it('should not react to actions until start watching action is dispatched', () => {
      store.dispatch(appActions.setBlockNumber(10));

      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should make an initial fetch call when watching is started', () => {
      store.dispatch(mockActions.watch());

      expect(mockFetch).toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    describe('watching', () => {
      beforeEach(() => {
        store.dispatch(mockActions.watch());

        mockFetch.mockClear();
      });

      it('should update on account and blockNumber change', () => {
        store.dispatch(appActions.setAccount());
        store.dispatch(appActions.setBlockNumber(31));

        expect(mockFetch).not.toHaveBeenCalled();
        expect(mockUpdate).toHaveBeenCalledTimes(2);
      });

      it('should refetch on walletConnected(chain change)', () => {
        store.dispatch(appActions.walletConnected(mockProvider));

        expect(mockFetch).toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
      });

      it('should stop reacting to actions when stop actions is dispatched', () => {
        store.dispatch(mockActions.stopWatching());

        store.dispatch(appActions.setAccount());
        store.dispatch(appActions.setBlockNumber(31));
        store.dispatch(appActions.walletConnected(mockProvider));

        expect(mockFetch).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
      });
    });
  });
});
