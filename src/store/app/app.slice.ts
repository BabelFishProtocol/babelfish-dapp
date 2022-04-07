import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { ActionsType } from '../types';
import { AppState } from './app.state';

const initialState = { ...new AppState() };

export const appSlice = createSlice({
  name: Reducers.App,
  initialState,
  reducers: {
    setConnectedWallet: (
      state,
      { payload }: PayloadAction<AppState['connectedWallet']>
    ) => {
      state.connectedWallet = payload;
    },
    setChainId: (state, { payload }: PayloadAction<AppState['chainId']>) => {
      state.chainId = payload;
    },
    setAccount: (state, { payload }: PayloadAction<AppState['account']>) => {
      state.account = payload;
    },
    walletConnected: (state, { payload }: PayloadAction<Web3Provider>) => {
      state.currentBlockNumber = undefined;
      state.provider = payload;
    },
    walletDisconnected: (state) => {
      state.currentBlockNumber = undefined;
      state.provider = undefined;
      state.connectedWallet = undefined;
    },
    setBlockNumber: (state, { payload }: PayloadAction<number>) => {
      state.currentBlockNumber = payload;
    },
    setSupportedNetworks: (
      state,
      { payload }: PayloadAction<AppState['supportedNetworks']>
    ) => {
      state.supportedNetworks = payload;
    },
    setWrongNetworkModal: (state, { payload }: PayloadAction<boolean>) => {
      state.wrongNetworkModal = payload;
    },
  },
});

const { actions: appActions, reducer: appReducer } = appSlice;
export { appActions, appReducer };

export type AppActions = ActionsType<typeof appActions>;
