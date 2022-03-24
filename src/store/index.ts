import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { Reducers } from '../constants';
import { indexSaga } from './saga';
import { appReducer } from './app/app.slice';
import { stakingReducer } from './staking/staking.slice';
import { proposalsReducer } from './proposals/proposals.slice';
import { aggregatorReducer } from './aggregator/aggregator.slice';
import { vestingReducer } from './vesting/vesting.slice';

export const rootReducer = {
  [Reducers.Aggregator]: aggregatorReducer,
  [Reducers.App]: appReducer,
  [Reducers.Staking]: stakingReducer,
  [Reducers.Proposals]: proposalsReducer,
  [Reducers.Vesting]: vestingReducer,
};

const sagaMiddleware = createSagaMiddleware();

export const getStore = (rootSaga = indexSaga, reducer = rootReducer) => {
  const store = configureStore({
    reducer,
    middleware: [sagaMiddleware],
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export const store = getStore();

export type RootState = ReturnType<typeof store.getState>;
