import {
  put,
  take,
  call,
  fork,
  cancel,
  select,
  takeLatest,
  all,
} from 'typed-redux-saga';
import { SubscriptionClient } from 'subscription-client';
import { END, eventChannel, Task } from 'redux-saga';
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
  SubscriptionResponse,
  SubscriptionSagaConfig,
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

/**
 * @description function that handles subgraph subscriptions
 * @param config
 *    - query:            Subscription query to be executed
 *    - variables:        Query variables
 *    - fetchSaga:        Saga that will be triggered on each event
 *    - stopAction:       Action to stop the subscription
 *    - watchDataAction:  Action to start subscription(used for restarting subscriptions)
 */
export function* subscriptionSaga<Result, Variables = unknown>({
  query,
  fetchSaga,
  stopAction,
  variables,
  watchDataAction,
}: SubscriptionSagaConfig<Result, Variables>) {
  const createPoolChanel = (client: SubscriptionClient) =>
    eventChannel<SubscriptionResponse<Result>>((emit) => {
      const subscription = client
        .request({
          query,
          variables,
        })
        .subscribe({
          next({ data, errors = [] }) {
            const [error] = errors;

            if (error) {
              emit({ isError: true, error });
              return;
            }

            emit({ isError: false, data: data as unknown as Result });
          },
        });

      return () => {
        subscription.unsubscribe();
        emit(END);
      };
    });

  let subgraphWsClient = yield* select(subgraphWsClientSelector);

  if (!subgraphWsClient) {
    yield* take(appActions.walletConnected.type);

    subgraphWsClient = (yield* select(
      subgraphWsClientSelector
    )) as SubscriptionClient;
  }

  const channel = yield* call(createPoolChanel, subgraphWsClient);

  const stopListener = (yield* takeLatest(
    stopAction.type,
    closeChannel
  )) as Task;

  const chainIdListener = (yield* takeLatest(
    appActions.setChainId.type,
    restartConnection
  )) as Task;

  const accountListener = (yield* takeLatest(
    appActions.setAccount.type,
    restartConnection
  )) as Task;

  function* closeChannel() {
    yield* call(channel.close);

    yield* all([
      cancel(stopListener),
      cancel(chainIdListener),
      cancel(accountListener),
    ]);
  }

  function* restartConnection() {
    yield* closeChannel();
    yield* put(watchDataAction());
  }

  try {
    while (true) {
      const data = yield* take(channel);

      yield* call(fetchSaga, data);
    }
    // eslint-disable-next-line no-empty
  } finally {
  }
}
