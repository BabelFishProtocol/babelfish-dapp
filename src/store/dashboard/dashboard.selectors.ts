import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { Reducers } from '../../constants';
import { RootState } from '..';
import { LoadableAmount } from '../types';
import { ERC20__factory } from '../../contracts/types';
import { TokenEnum, tokens } from '../../config/tokens';
import {
  currentChainSelector,
  providerSelector,
  xusdLocalTransactionsSelector,
} from '../app/app.selectors';

const dashboardState = (state: RootState) => state[Reducers.Dashboard];

export const xusdTokenSelector = createSelector(
  [providerSelector, currentChainSelector],
  (provider, chain) => {
    if (!chain || !provider) {
      return undefined;
    }

    const tokenAddress = tokens[TokenEnum.XUSD].addresses[chain.id];

    return tokenAddress
      ? ERC20__factory.connect(tokenAddress, provider.getSigner())
      : undefined;
  }
);

export const dashboardBalancesSelector = createSelector(
  dashboardState,
  (state) => state.balances
);

export const fishBalanceSelector = createSelector(
  dashboardBalancesSelector,
  ({ data, state }): LoadableAmount => ({
    state,
    data: data?.fishBalance,
  })
);

export const totalFishSelector = createSelector(
  dashboardBalancesSelector,
  ({ data, state }): LoadableAmount => ({
    state,
    data: data?.totalFish,
  })
);

export const xusdBalanceSelector = createSelector(
  dashboardBalancesSelector,
  ({ data, state }): LoadableAmount => ({
    state,
    data: data?.xusdBalance,
  })
);

export const transactionsSelector = createSelector(
  dashboardState,
  xusdLocalTransactionsSelector,
  (state, xusdLocalTx) => {
    const fetchedTx = state.transactionList.data;

    // TODO sort with real data -> 'pending' (w/o. date) first, then sort by date
    const data = xusdLocalTx ? [...xusdLocalTx, ...fetchedTx] : fetchedTx;

    return { data, state: state.transactionList.state };
  }
);
