import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChainEnum } from '../../config/chains';
import { Reducers } from '../../constants';
import {
  UpdateTxStatus,
  XusdLocalTransaction,
} from '../aggregator/aggregator.state';
import { ActionsType } from '../types';
import { AppState } from './app.state';

const initialState = { ...new AppState() };

export const hasLocalTransactions = (
  state: AppState
): state is AppState & {
  chainId: ChainEnum;
  account: string;
} =>
  !(
    !state.chainId ||
    !state.account ||
    !state.xusdLocalTransactions[state.chainId] ||
    !state.xusdLocalTransactions[state.chainId][state.account]
  );

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
      state.chainId = undefined;
      state.account = undefined;
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
    setWalletNotConnectedNetworkModal: (
      state,
      { payload }: PayloadAction<boolean>
    ) => {
      state.walletNotConnectedModal = payload;
    },
    setLocalXusdTransactions: (
      state,
      { payload }: PayloadAction<XusdLocalTransaction>
    ) => {
      if (!state.chainId || !state.account) {
        return;
      }

      if (!state.xusdLocalTransactions[state.chainId]) {
        state.xusdLocalTransactions[state.chainId] = {
          [state.account]: [payload],
        };
        return;
      }

      if (!state.xusdLocalTransactions[state.chainId][state.account]) {
        state.xusdLocalTransactions[state.chainId][state.account] = [payload];
        return;
      }

      state.xusdLocalTransactions[state.chainId][state.account].unshift(
        payload
      );
    },
    updateLocalXusdTransactionStatus: (
      state,
      { payload }: PayloadAction<UpdateTxStatus>
    ) => {
      if (hasLocalTransactions(state)) {
        const txToUpdate = state.xusdLocalTransactions[state.chainId][
          state.account
        ].find(({ txHash }) => txHash === payload.txHash);

        if (!txToUpdate || txToUpdate.status === payload.newStatus) {
          return;
        }

        txToUpdate.status = payload.newStatus;
      }
    },
    removeLocalXusdTransactions: (
      state,
      { payload }: PayloadAction<XusdLocalTransaction[]>
    ) => {
      if (hasLocalTransactions(state)) {
        const filteredTransactions = state.xusdLocalTransactions[state.chainId][
          state.account
        ].filter((tx) => !payload.find((ptx) => ptx.txHash === tx.txHash));

        state.xusdLocalTransactions[state.chainId][state.account] =
          filteredTransactions;
      }
    },
  },
});

const { actions: appActions, reducer: appReducer } = appSlice;
export { appActions, appReducer };

export type AppActions = ActionsType<typeof appActions>;
