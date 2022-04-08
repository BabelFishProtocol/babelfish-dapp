import { FiniteStates } from '../../../utils/types';

export type TransactionsTableItem = {
  eventName: 'Deposit' | 'Withdraw' | 'Reward';
  asset: 'XUSD' | 'FISH';
  amount: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Failed';
};

export type TransactionsTableComponentProps = {
  transactions: TransactionsTableItem[];
  state: FiniteStates;
};
