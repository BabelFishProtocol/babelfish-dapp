import { configureStore } from '@reduxjs/toolkit';
import { Reducers } from '../constants';
import { appReducer } from './app/app.slice';
import { stakingReducer } from './staking/staking.slice';

export const store = configureStore({
  reducer: {
    [Reducers.App]: appReducer,
    [Reducers.Staking]: stakingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
