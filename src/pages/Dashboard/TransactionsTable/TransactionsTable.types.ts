import { TransactionsQueryItem } from '../../../queries/transactionsQuery';
import { FiniteStates } from '../../../utils/types';

export type TransactionStatus = 'Pending' | 'Confirmed' | 'Failed';

export type TransactionsTableItem = Omit<TransactionsQueryItem, 'id' | 'date'> &
  Partial<Pick<TransactionsQueryItem, 'id' | 'date'>> & {
    status: TransactionStatus;
  };

export type TransactionsTableComponentProps = {
  transactions: TransactionsTableItem[];
  state: FiniteStates;
};
