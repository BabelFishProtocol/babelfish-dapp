import { TransactionsQueryItem } from '../../../queries/transactionsQuery';
import { FiniteStates } from '../../../utils/types';

export type TransactionsTableItem = Omit<TransactionsQueryItem, 'id' | 'date'> &
  Partial<Pick<TransactionsQueryItem, 'id' | 'date'>> & {
    status: 'Pending' | 'Confirmed' | 'Failed';
  };

export type TransactionsTableComponentProps = {
  transactions: TransactionsTableItem[];
  state: FiniteStates;
};
