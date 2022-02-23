import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { Reducers } from '../constants';
import { indexSaga, indexSaga } from './saga';
import { appReducer } from './app/app.slice';
import { stakingReducer } from './staking/staking.slice';
import { proposalsReducer } from './proposals/proposals.slice';

export const rootReducer = {
  [Reducers.App]: appReducer,
  [Reducers.Staking]: stakingReducer,
  [Reducers.Proposals]: proposalsReducer,
};

const sagaMiddleware = createSagaMiddleware();

export const getStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware],
  });

  sagaMiddleware.run(indexSaga);

  return store;
};

export const store = getStore();

export type RootState = ReturnType<typeof store.getState>;
