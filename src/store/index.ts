import { configureStore } from '@reduxjs/toolkit';
import { Reducers } from '../constants';
import { stakingReducer } from './staking/staking.slice';

export const store = configureStore({
  reducer: {
    [Reducers.Staking]: stakingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
