import { ContractCall } from 'ethers-multicall';
import { BaseContract } from 'ethers';
import { ParamType } from 'ethers/lib/utils';
import { call, cancel, fork, put, take, takeLatest } from 'typed-redux-saga';

import { appActions } from './app/app.slice';
import {
  ContractStepCallSagaParams,
  CreateWatcherSagaOptions,
  MulticallContractCall,
  MulticallProviderType,
  MulticallResult,
  SagaContractCallStep,
} from './types';

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
    yield* call(fetchSaga);

    yield* takeLatest(
      [appActions.setAccount.type, appActions.setBlockNumber.type],
      updateSaga
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
      status: 'loading',
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
