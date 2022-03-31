import { ActionCreatorsMapObject } from '@reduxjs/toolkit';
import { BaseContract, Contract, Signer } from 'ethers';
import { ContractCall, Provider } from 'ethers-multicall';
import { SagaIterator } from 'redux-saga';
import { ActionPattern } from 'redux-saga/effects';
import { ContractCallResult, FiniteStates } from '../utils/types';

export type LoadableValue<Data> = {
  data: Data;
  state: FiniteStates;
};

export type LoadableAmount = LoadableValue<string | undefined>;

export type ActionsType<A extends ActionCreatorsMapObject> = {
  [actionName in keyof A]: ReturnType<A[actionName]>;
};

export type BaseContractFactory = {
  connect: (address: string, signer: Signer) => Contract;
};

export type CreateWatcherSagaOptions = {
  fetchSaga: () => SagaIterator;
  updateSaga: () => SagaIterator;
  stopAction: ActionPattern;
};

export type MulticallContractCall<
  Contract extends BaseContract,
  Method extends keyof Contract['functions']
> = ContractCall & {
  _ts: Contract & Method;
};

type BaseCall = MulticallContractCall<
  BaseContract,
  keyof BaseContract['functions']
>;

export type MulticallResult<Calls extends BaseCall[]> = Promise<{
  [k in keyof Calls]: Calls[k] extends MulticallContractCall<infer V, infer G>
    ? ContractCallResult<V, G>[number]
    : never;
}>;

export type MulticallProviderType = Omit<Provider, 'all'> & {
  all: <Calls extends BaseCall[]>(calls: Calls) => MulticallResult<Calls>;
};
