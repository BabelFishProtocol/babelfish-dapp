import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { TransactionsQueryItem } from '../../queries/transactionsQuery';
import { XusdLocalTransaction } from '../aggregator/aggregator.state';
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
      state.walletNotConectedModal = payload;
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

      state.xusdLocalTransactions[state.chainId][state.account].push(payload);
    },
    removeLocalXusdTransactions: (
      state,
      { payload }: PayloadAction<TransactionsQueryItem[]>
    ) => {
      if (
        !state.chainId ||
        !state.account ||
        !state.xusdLocalTransactions[state.chainId] ||
        !state.xusdLocalTransactions[state.chainId][state.account]
      ) {
        return;
      }

      const getTxHash = ({ txHash }: { txHash: string }) => ({ txHash });

      const txsToRemove = new Set(payload.map(getTxHash));

      state.xusdLocalTransactions[state.chainId][state.account].filter(
        (tx) => !txsToRemove.has(tx)
      );

      if (
        state.xusdLocalTransactions[state.chainId][state.account].length === 0
      ) {
        delete state.xusdLocalTransactions[state.chainId][state.account];
      }
    },
  },
});

const { actions: appActions, reducer: appReducer } = appSlice;
export { appActions, appReducer };

export type AppActions = ActionsType<typeof appActions>;
