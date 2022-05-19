import {
  put,
  take,
  call,
  fork,
  cancel,
  select,
  takeLatest,
} from 'typed-redux-saga';
import { SubscriptionClient } from 'subscription-client';
import { END, eventChannel, SagaIterator } from 'redux-saga';
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { ContractCall } from 'ethers-multicall';
import { BaseContract } from 'ethers';
import { ParamType } from 'ethers/lib/utils';

import { appActions } from '../app/app.slice';
import {
  providerSelector,
  subgraphWsClientSelector,
} from '../app/app.selectors';
import {
  CreateWatcherSagaOptions,
  MulticallContractCall,
  MulticallProviderType,
  MulticallResult,
  SagaContractCallStep,
} from '../types';
import { ContractStepCallSagaParams } from './utils.types';

export const convertForMulticall = <
  Contract extends BaseContract,
  Method extends keyof Contract['functions']
>(
  contract: Contract,
  method: Method,
  fullMethodName: keyof Contract['interface']['functions'],
  ...args: Parameters<Contract['functions'][Method]>
) => {
  const funcData = contract.interface.functions[
    fullMethodName as string
  ] as Omit<ContractCall, 'params' | 'contract'>;

  const contractCall: ContractCall = {
    ...funcData,
    contract: {
      address: contract.address,
    },
    params: args as ParamType[],
  };

  return contractCall as MulticallContractCall<Contract, Method>;
};

export function* multiCall<
  Calls extends MulticallContractCall<
    BaseContract,
    keyof BaseContract['functions']
  >[]
>(provider: MulticallProviderType, ...calls: Calls) {
  const result = yield* call([provider, provider.all], calls);

  return result as Awaited<MulticallResult<Calls>>;
}

/**
 * @description function that creates sagas that triggers fetch and update with wallet updates
 * @param options Object containing:
 *  - fetchSaga: saga to fetch data. Will be triggered on: account and block number changes
 *  - updateSaga: saga to update data. Will be triggered on: watching start, chainId changes
 *  - stopAction: name of action that will stop saga watching
 * @returns saga that should be hooked up to "watching start" action
 */
export const createWatcherSaga = ({
  fetchSaga,
  updateSaga,
  stopAction,
}: CreateWatcherSagaOptions) => {
  function* runUpdater() {
    let provider = yield* select(providerSelector);

    if (provider) {
      yield* call(fetchSaga);
    }

    function* update() {
      provider = yield* select(providerSelector);

      if (provider) {
        yield* call(updateSaga);
      }
    }

    yield* takeLatest(
      [appActions.setAccount.type, appActions.setBlockNumber.type],
      update
    );

    yield* takeLatest([appActions.walletConnected.type], fetchSaga);
  }

  function* runWatcher() {
    const updaterTask = yield* fork(runUpdater);

    yield* take(stopAction);

    yield* cancel(updaterTask);
  }

  return runWatcher;
};

function* stepCall<Operations extends string>(
  { effect, name }: SagaContractCallStep<Operations>,
  setStatusAction: ContractStepCallSagaParams<Operations>['setStatusAction'],
  setStepDataAction: ContractStepCallSagaParams<Operations>['setStepDataAction']
) {
  yield* put(
    setStatusAction({
      currentOperation: name,
    })
  );

  const tx = yield* effect;

  yield* put(setStepDataAction({ tx }));

  const txReceipt = yield* call(tx.wait);

  yield* put(setStepDataAction({ txReceipt }));
}

/**
 * @description function that calls multiple contract calls with proper state updates
 * @param config Object containing:
 *    - steps:             List of contract calls with corresponding names
 *    - setErrorAction:    Action that will be dispatched in case of error
 *    - setStatusAction:   Action to update the state
 *    - setStepDataAction: Action to update step call data
 */
export function* contractStepCallsSaga<Operations extends string>({
  steps,
  setErrorAction,
  setStatusAction,
  setStepDataAction,
}: ContractStepCallSagaParams<Operations>) {
  try {
    yield* put(setStatusAction({ status: 'loading' }));

    // eslint-disable-next-line no-restricted-syntax
    for (const step of steps) {
      yield* stepCall(step, setStatusAction, setStepDataAction);
    }

    yield* put(setStatusAction({ status: 'success' }));
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : 'An unexpected error has occurred. Please try again';

    yield* put(setErrorAction(msg));
  }
}

type SubscriptionSagaConfig<Result, Variables> = {
  query: string;
  stopAction: ActionCreatorWithoutPayload;
  watchData: ActionCreatorWithoutPayload;
  fetchSaga: (data: Result | Error) => SagaIterator;
  variables?: Variables;
};

export function* subscriptionSaga<Result, Variables>({
  query,
  fetchSaga,
  stopAction,
  variables,
  watchData,
}: SubscriptionSagaConfig<Result, Variables>) {
  function createPoolChanel(client: SubscriptionClient) {
    return eventChannel<Result | Error>((emit) => {
      const subscription = client
        .request({
          query,
          variables,
        })
        .subscribe({
          next({ data }) {
            emit(data as unknown as Result);
          },
          error(e) {
            emit(e);
          },
        });

      return () => {
        subscription.unsubscribe();
        emit(END);
      };
    });
  }

  let subgraphWsClient = yield* select(subgraphWsClientSelector);

  if (!subgraphWsClient) {
    yield* take(appActions.walletConnected.type);
    subgraphWsClient = yield* select(subgraphWsClientSelector);
  }

  const channel = yield* call(
    createPoolChanel,
    subgraphWsClient as SubscriptionClient
  );

  function* closeChannel() {
    yield* call(channel.close);
  }

  function* restartConnection() {
    yield* closeChannel();
    yield* put(watchData());
  }

  yield* takeLatest(stopAction.type, closeChannel);
  yield* takeLatest(appActions.setChainId.type, restartConnection);
  yield* takeLatest(appActions.setAccount.type, restartConnection);

  try {
    while (true) {
      const data = yield* take(channel);

      yield* call(fetchSaga, data);
    }
  } finally {
    yield* closeChannel();
  }
}
