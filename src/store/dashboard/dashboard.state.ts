import { TransactionsQueryItem } from '../../queries/transactionsQuery';
import { LoadableValue } from '../types';

export type DashboardBalances = {
  fishBalance: string;
  totalFish: string;
  xusdBalance: string;
};

export class DashboardState {
  balances: LoadableValue<DashboardBalances | undefined> = {
    state: 'idle',
    data: undefined,
  };

  transactionList: LoadableValue<TransactionsQueryItem[]> = {
    state: 'idle',
    data: [],
  };
}
