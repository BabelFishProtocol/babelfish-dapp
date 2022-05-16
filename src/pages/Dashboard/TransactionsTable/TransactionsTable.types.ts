import { TransactionsQueryItem } from '../../../queries/transactionsQuery';
import { FiniteStates } from '../../../utils/types';

export type TransactionsTableItem = TransactionsQueryItem & {
  // TODO add status using localStorage
  // status: 'Pending' | 'Confirmed' | 'Failed';
};

export type TransactionsTableComponentProps = {
  transactions: TransactionsTableItem[];
  state: FiniteStates;
};
