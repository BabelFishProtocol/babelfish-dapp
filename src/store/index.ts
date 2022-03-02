import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { Reducers } from '../constants';
import { appReducer } from './app/app.slice';
import { indexSaga } from './saga';
import { stakingReducer } from './staking/staking.slice';

export const rootReducer = {
  [Reducers.App]: appReducer,
  [Reducers.Staking]: stakingReducer,
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
