import { TransactionsTableItem } from '../../pages/Dashboard/TransactionsTable/TransactionsTable.types';
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

  transactionList: LoadableValue<TransactionsTableItem[]> = {
    state: 'idle',
    data: [],
  };
}
