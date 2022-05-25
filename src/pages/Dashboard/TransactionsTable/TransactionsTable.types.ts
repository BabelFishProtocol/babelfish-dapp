import { TransactionsQueryItem } from '../../../queries/transactionsQuery';
import { FiniteStates } from '../../../utils/types';

export type TransactionStatus = 'Pending' | 'Confirmed' | 'Failed';

export type TransactionsTableItem = Omit<TransactionsQueryItem, 'id'> &
  Partial<Pick<TransactionsQueryItem, 'id'>> & {
    status: TransactionStatus;
  };

export type TransactionsTableComponentProps = {
  transactions: TransactionsTableItem[];
  state: FiniteStates;
};
