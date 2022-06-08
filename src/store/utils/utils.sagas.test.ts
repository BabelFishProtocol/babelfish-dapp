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

import {
  Observable,
  OperationOptions,
  SubscriptionClient,
} from 'subscription-client';
import { ExecutionResult } from 'graphql/execution/execute';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { GraphQLError } from 'graphql';
import { getStore, rootReducer } from '..';
import { Reducers } from '../../constants';
import { mockProvider } from '../../testUtils';
import { appActions, appReducer } from '../app/app.slice';
import { indexSaga } from '../saga';
import { SagaContractCallStep } from '../types';
import {
  contractStepCallsSaga,
  createWatcherSaga,
  subscriptionSaga,
} from './utils.sagas';
import { StepCallsActions } from './utils.types';
import * as appSelectors from '../app/app.selectors';

const unsubscribe = jest.fn();

class MockSubgraphWsClient extends SubscriptionClient {
  private nextCallback?: (
    value: ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>
  ) => void;

  request(
    _: OperationOptions
  ): Observable<ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>> {
    return {
      subscribe: ({ next }) => {
        this.nextCallback = next;
        return { unsubscribe };
      },
    };
  }
  triggerNext(data: ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>) {
    this.nextCallback?.(data);
  }
}

const mockReducers = {
  watch: () => {},
  stopWatching: () => {},
};

const createMockSlice = () => {
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

  return {
    mockActions,
    mockRootReducer,
  };
};

const createMockWatcherSagaStore = () => {
  const { mockActions, mockRootReducer } = createMockSlice();

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

const createMockSubscriptionsStore = () => {
  const { mockActions, mockRootReducer } = createMockSlice();

  const mockFetch = jest.fn();
  function* mockFetchSaga(arg: unknown) {
    yield* call(mockFetch, arg);
  }

  function* mockSubscriptionSaga() {
    yield* subscriptionSaga({
      fetchSaga: mockFetchSaga,
      stopAction: mockActions.stopWatching,
      watchDataAction: mockActions.watch,
      query: '',
    });
  }

  function* mockIndexSaga() {
    yield* takeLatest(mockActions.watch.type, mockSubscriptionSaga);
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
      const created = createMockWatcherSagaStore();

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

      it('should not trigger updates when provider is settled', () => {
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

    const mockSetErrorAction =
      createAction<StepCallsActions<string>['setError']['payload']>(
        'mockSetErrorAction'
      );

    const mockSetStatusAction = createAction<
      StepCallsActions<string>['setStatus']['payload']
    >('mockSetStatusAction');

    const mockSetStepDataAction = createAction<
      StepCallsActions<string>['updateStep']['payload']
    >('mockSetStepDataAction');

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
        .put(mockSetStatusAction({ currentOperation: 'step1' }))
        .next()
        .call(mockContract.testStep1Method, 1)
        .next(mockStep1Tx)
        .put(mockSetStepDataAction({ tx: mockStep1Tx }))
        .next()
        .call(mockStep1Tx.wait)
        .next(mockStep1TxReceipt)
        .put(mockSetStepDataAction({ txReceipt: mockStep1TxReceipt }))
        .next()
        .put(mockSetStatusAction({ currentOperation: 'step2' }))
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
        .put(mockSetStatusAction({ currentOperation: 'step1' }))
        .put(mockSetStepDataAction({ tx: mockStep1Tx }))
        .put(mockSetStepDataAction({ txReceipt: mockStep1TxReceipt }))
        .put(mockSetStatusAction({ currentOperation: 'step2' }))
        .put(mockSetErrorAction('test error'))
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('subscriptionSaga', () => {
    let store: Store;
    let mockFetch: jest.Mock;
    let mockActions: CaseReducerActions<typeof mockReducers>;
    let subgraphWsClient: MockSubgraphWsClient;

    describe('subscriptions', () => {
      beforeEach(() => {
        subgraphWsClient = new MockSubgraphWsClient('ws://testUrl');
        jest
          .spyOn(appSelectors, 'subgraphWsClientSelector')
          .mockReturnValue(subgraphWsClient);

        const created = createMockSubscriptionsStore();

        store = created.store;
        mockFetch = created.mockFetch;
        mockActions = created.mockActions;

        store.dispatch(mockActions.watch());
      });

      it('triggers fetchSaga on each event', () => {
        subgraphWsClient.triggerNext({ data: { test: 'test' } });
        expect(mockFetch).toBeCalledWith({
          data: { test: 'test' },
          isError: false,
        });

        subgraphWsClient.triggerNext({ data: { test: 'test2' } });
        expect(mockFetch).toBeCalledWith({
          data: { test: 'test2' },
          isError: false,
        });
      });

      it('stops subscribing when stopAction is dispatched', () => {
        store.dispatch(mockActions.stopWatching());
        expect(mockFetch).not.toHaveBeenCalled();

        expect(unsubscribe).toHaveBeenCalled();
      });

      it('returns proper error in case of failure in query', () => {
        const error = new Error('query error');
        subgraphWsClient.triggerNext({
          data: undefined,
          errors: [error as GraphQLError],
        });
        expect(mockFetch).toBeCalledWith({ error, isError: true });
      });

      it('resets connection when chain is changed', () => {
        jest.spyOn(subgraphWsClient, 'request');

        store.dispatch(appActions.setChainId(31));
        expect(unsubscribe).toHaveBeenCalled();
        expect(subgraphWsClient.request).toHaveBeenCalled();
      });

      it('resets connection when account is changed', () => {
        jest.spyOn(subgraphWsClient, 'request');

        store.dispatch(appActions.setAccount('test'));
        expect(unsubscribe).toHaveBeenCalled();
        expect(subgraphWsClient.request).toHaveBeenCalled();
      });
    });

    it('waits for wallet to be connected before starting the subscription if client is undefined', () => {
      subgraphWsClient = new MockSubgraphWsClient('ws://testUrl');
      jest.spyOn(subgraphWsClient, 'request');

      jest
        .spyOn(appSelectors, 'subgraphWsClientSelector')
        .mockReturnValue(undefined);

      const created = createMockSubscriptionsStore();
      store = created.store;
      mockFetch = created.mockFetch;
      mockActions = created.mockActions;

      store.dispatch(mockActions.watch());

      expect(subgraphWsClient.request).not.toHaveBeenCalled();

      jest
        .spyOn(appSelectors, 'subgraphWsClientSelector')
        .mockReturnValue(subgraphWsClient);

      store.dispatch(appActions.walletConnected(mockProvider));

      expect(subgraphWsClient.request).toHaveBeenCalled();
    });
  });
});
