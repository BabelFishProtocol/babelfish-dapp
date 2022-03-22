import { BaseContract } from 'ethers';
import { ParamType } from 'ethers/lib/utils';
import { ContractCall } from 'ethers-multicall';
import { SagaIterator } from 'redux-saga';
import { ActionPattern } from 'redux-saga/effects';
import { call, cancel, fork, take, takeLatest } from 'typed-redux-saga';

import { appActions } from './app/app.slice';

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

  return contractCall;
};

type CreateWatcherSagaOptions = {
  fetchSaga: () => SagaIterator;
  updateSaga: () => SagaIterator;
  stopAction: ActionPattern;
};

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
