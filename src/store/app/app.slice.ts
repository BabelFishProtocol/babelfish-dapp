import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { AppState } from './app.state';

const initialState = { ...new AppState() };

export const appSlice = createSlice({
  name: Reducers.App,
  initialState,
  reducers: {
    setChainId: (state, { payload }: PayloadAction<AppState['chainId']>) => {
      state.chainId = payload;
    },
    setAccount: (state, { payload }: PayloadAction<AppState['account']>) => {
      state.account = payload;
    },
  },
});

const { actions: appActions, reducer: appReducer } = appSlice;

export { appActions, appReducer };
