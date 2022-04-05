import { TransactionsTableItem } from './TransactionsTable.types';
import { TransactionsTableComponent } from './TransactionsTable.component';

const mockTransactionsData: TransactionsTableItem[] = [
  {
    eventName: 'Deposit',
    asset: 'XUSD',
    amount: '+100,000.0000',
    date: '03/10/21',
    status: 'Pending',
  },
  {
    eventName: 'Withdraw',
    asset: 'XUSD',
    amount: '-100,000.0000',
    date: '03/01/22',
    status: 'Failed',
  },
  {
    eventName: 'Deposit',
    asset: 'XUSD',
    amount: '+100,000.0000',
    date: '02/01/22',
    status: 'Confirmed',
  },
  {
    eventName: 'Reward',
    asset: 'FISH',
    amount: '+100,000.0000',
    date: '01/01/22',
    status: 'Confirmed',
  },
];

export const TransactionsTableContainer = () => (
  <TransactionsTableComponent
    state="idle"
    transactions={mockTransactionsData}
  />
);
