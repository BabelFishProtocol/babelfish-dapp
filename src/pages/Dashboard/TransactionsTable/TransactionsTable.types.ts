import { TransactionsQueryItem } from '../../../queries/transactionsQuery';
import { FiniteStates } from '../../../utils/types';

// TODO Omit to make it optional?
export type TransactionsTableItem = Omit<
  TransactionsQueryItem,
  'id' | 'date'
> & {
  status: 'Pending' | 'Confirmed' | 'Failed';
  id?: string;
  date?: string;
};

export type TransactionsTableComponentProps = {
  transactions: TransactionsTableItem[];
  state: FiniteStates;
};
