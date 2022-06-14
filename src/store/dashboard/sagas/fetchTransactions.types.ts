import { DeepPartial } from 'react-hook-form';
import { RootState } from '../..';
import { TransactionsTableItem } from '../../../pages/Dashboard/TransactionsTable/TransactionsTable.types';
import { XusdLocalTransaction } from '../../aggregator/aggregator.state';

export type GetInitialState = {
  localTx: XusdLocalTransaction[];
};

export type GetSuccesState = {
  initialState: DeepPartial<RootState>;
  fetchedTx?: TransactionsTableItem[];
  localTx?: XusdLocalTransaction[] | [];
};

export enum TxReceiptStatus {
  Failed = 0,
  Valid = 1,
}
