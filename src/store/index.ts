import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import { Reducers } from '../constants';
import { indexSaga } from './saga';
import { appReducer } from './app/app.slice';
import { stakingReducer } from './staking/staking.slice';
import { proposalsReducer } from './proposals/proposals.slice';
import { aggregatorReducer } from './aggregator/aggregator.slice';
import { vestingReducer } from './vesting/vesting.slice';
import { dashboardReducer } from './dashboard/dashboard.slice';

export const rootReducer = combineReducers({
  [Reducers.Aggregator]: aggregatorReducer,
  [Reducers.App]: appReducer,
  [Reducers.Dashboard]: dashboardReducer,
  [Reducers.Staking]: stakingReducer,
  [Reducers.Proposals]: proposalsReducer,
  [Reducers.Vesting]: vestingReducer,
});

const persistConfig = {
  key: 'xusdLocalTransactions',
  storage,
};

const sagaMiddleware = createSagaMiddleware();

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const getStore = (rootSaga = indexSaga, reducer = persistedReducer) => {
  const store = configureStore({
    reducer,
    middleware: [sagaMiddleware],
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export const store = getStore();
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
