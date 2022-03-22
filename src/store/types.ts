import { ActionCreatorsMapObject } from '@reduxjs/toolkit';
import { Contract, Signer } from 'ethers';
import { SagaIterator } from 'redux-saga';
import { ActionPattern } from 'redux-saga/effects';
import { FiniteStates } from '../utils/types';

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
