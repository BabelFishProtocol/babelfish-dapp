import { TransactionReceipt } from '@ethersproject/providers';
import {
  Store,
  createSlice,
  createAction,
  CaseReducerActions,
} from '@reduxjs/toolkit';
import { ContractTransaction } from 'ethers';
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { call, takeLatest } from 'typed-redux-saga';

import { getStore, rootReducer } from '..';
import { Reducers } from '../../constants';
import { mockProvider } from '../../testUtils';
import { appActions, appReducer } from '../app/app.slice';
import { indexSaga } from '../saga';
import { CallState, SagaContractCallStep, StepData } from '../types';
import { contractStepCallsSaga, createWatcherSaga } from './utils.sagas';

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

    it('should not make an initial fetch call when watching is started and address is not set', () => {
      store.dispatch(mockActions.watch());

      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should make an initial fetch call when watching is started and address is set', () => {
      store.dispatch(appActions.walletConnected(mockProvider));
      store.dispatch(mockActions.watch());

      expect(mockFetch).toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    describe('watching', () => {
      beforeEach(() => {
        store.dispatch(mockActions.watch());
        store.dispatch(appActions.walletConnected(mockProvider));

        mockFetch.mockClear();
      });

      it('should update on account and blockNumber change', () => {
        store.dispatch(appActions.setBlockNumber(31));
        store.dispatch(appActions.setAccount('test account'));

        expect(mockFetch).not.toHaveBeenCalled();
        expect(mockUpdate).toHaveBeenCalledTimes(2);
      });

      it('should refetch on walletConnected(chain change)', () => {
        store.dispatch(appActions.walletConnected(mockProvider));

        expect(mockFetch).toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
      });

      it('should not trigger updates when provider is not settled', () => {
        store.dispatch(appActions.walletDisconnected());

        store.dispatch(appActions.setBlockNumber(31));
        store.dispatch(appActions.setAccount('test account'));

        expect(mockFetch).not.toHaveBeenCalled();
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

  describe('contractStepCallsSaga', () => {
    type MockSteps = 'step1' | 'step2';

    const mockStep1TxReceipt = { step1: true } as unknown as TransactionReceipt;
    const mockStep1Tx = {
      hash: 'step1Tx',
      wait: jest.fn().mockReturnValue(mockStep1TxReceipt),
    } as unknown as ContractTransaction;

    const mockStep2TxReceipt = { step2: true } as unknown as TransactionReceipt;
    const mockStep2Tx = {
      hash: 'step2Tx',
      wait: jest.fn().mockReturnValue(mockStep2TxReceipt),
    } as unknown as ContractTransaction;

    const mockContract = {
      testStep1Method: jest
        .fn<ContractTransaction, [number]>()
        .mockReturnValue(mockStep1Tx),

      testStep2Method: jest
        .fn<ContractTransaction, [number]>()
        .mockReturnValue(mockStep2Tx),
    };

    const mockSetErrorAction = createAction<string>('mockSetErrorAction');

    const mockSetStatusAction = createAction<
      Pick<CallState<string>, 'status' | 'currentOperation'>
    >('mockSetStatusAction');

    const mockSetStepDataAction = createAction<Partial<StepData<string>>>(
      'mockSetStepDataAction'
    );

    it('proper saga flow', async () => {
      const mockSteps: SagaContractCallStep<MockSteps>[] = [
        {
          name: 'step1',
          effect: call(mockContract.testStep1Method, 1),
        },
        {
          name: 'step2',
          effect: call(mockContract.testStep2Method, 2),
        },
      ];

      testSaga(contractStepCallsSaga, {
        steps: mockSteps,
        setErrorAction: mockSetErrorAction,
        setStatusAction: mockSetStatusAction,
        setStepDataAction: mockSetStepDataAction,
      })
        .next()
        .put(mockSetStatusAction({ status: 'loading' }))
        .next()
        .put(
          mockSetStatusAction({ currentOperation: 'step1', status: 'loading' })
        )
        .next()
        .call(mockContract.testStep1Method, 1)
        .next(mockStep1Tx)
        .put(mockSetStepDataAction({ tx: mockStep1Tx }))
        .next()
        .call(mockStep1Tx.wait)
        .next(mockStep1TxReceipt)
        .put(mockSetStepDataAction({ txReceipt: mockStep1TxReceipt }))
        .next()
        .put(
          mockSetStatusAction({ currentOperation: 'step2', status: 'loading' })
        )
        .next()
        .call(mockContract.testStep2Method, 2)
        .next(mockStep2Tx)
        .put(mockSetStepDataAction({ tx: mockStep2Tx }))
        .next()
        .call(mockStep2Tx.wait)
        .next(mockStep2TxReceipt)
        .put(mockSetStepDataAction({ txReceipt: mockStep2TxReceipt }))
        .next()
        .put(mockSetStatusAction({ status: 'success' }))
        .next()
        .isDone();
    });

    it('fetching error', async () => {
      const mockSteps: SagaContractCallStep<MockSteps>[] = [
        {
          name: 'step1',
          effect: call(mockContract.testStep1Method, 1),
        },
        {
          name: 'step2',
          effect: call(mockContract.testStep2Method, 2),
        },
      ];

      const runResult = await expectSaga(contractStepCallsSaga, {
        steps: mockSteps,
        setErrorAction: mockSetErrorAction,
        setStatusAction: mockSetStatusAction,
        setStepDataAction: mockSetStepDataAction,
      })
        .provide([
          [
            matchers.call.fn(mockContract.testStep2Method),
            throwError(new Error('test error')),
          ],
        ])
        .call(mockContract.testStep1Method, 1)
        .call(mockContract.testStep2Method, 2)
        .call(mockStep1Tx.wait)
        .put(mockSetStatusAction({ status: 'loading' }))
        .put(
          mockSetStatusAction({ currentOperation: 'step1', status: 'loading' })
        )
        .put(mockSetStepDataAction({ tx: mockStep1Tx }))
        .put(mockSetStepDataAction({ txReceipt: mockStep1TxReceipt }))
        .put(
          mockSetStatusAction({ currentOperation: 'step2', status: 'loading' })
        )
        .put(mockSetErrorAction('test error'))
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
});
