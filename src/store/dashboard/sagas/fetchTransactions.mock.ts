import {
  TransactionsTableItem,
  TransactionStatus,
} from '../../../pages/Dashboard/TransactionsTable/TransactionsTable.types';
import {
  TransactionsQueryItem,
  TransactionsQueryResult,
} from '../../../queries/transactionsQuery';

export const transactionsResult: TransactionsQueryResult = {
  xusdTransactions: [
    {
      id: '0x005-2',
      event: 'Deposit',
      asset: 'XUSD',
      amount: '50000',
      user: '0x02222',
      date: '1624006551',
      txHash: '0x00',
    },
    {
      id: '0x02c-6',
      event: 'Deposit',
      asset: 'XUSD',
      amount: '49500',
      user: '0x0123',
      date: '1636084223',
      txHash: '0x01',
    },
    {
      id: '0x02c-9',
      event: 'Deposit',
      asset: 'XUSD',
      amount: '49500',
      user: '0x0123',
      date: '1636084223',
      txHash: '0x02',
    },
  ],
};

export const changeTxStatus = (
  status: TransactionStatus,
  transactions = transactionsResult.xusdTransactions
): TransactionsTableItem[] =>
  transactions.map((tx) => ({
    ...tx,
    status,
  }));

export const txWithChangedHash: TransactionsQueryItem[] =
  transactionsResult.xusdTransactions.map((tx, index) => ({
    ...tx,
    txHash: index === 0 ? index.toString() : tx.txHash,
  }));

export const diffTxsWithHash = (
  arr1: Array<any>,
  arr2: Array<any>
): TransactionsTableItem[] =>
  arr1.filter((tx) => !arr2.find((ptx) => ptx.txHash === tx.txHash));
