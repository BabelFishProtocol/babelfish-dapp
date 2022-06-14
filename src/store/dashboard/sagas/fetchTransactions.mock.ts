import { IEvent, IGetTransactionsQuery } from '../../../gql/graphql';

export const expectedTransactions: IGetTransactionsQuery = {
  xusdTransactions: [
    {
      id: '0x005c02ef6218988d39045ef3c11efdd4133b72754ad6eba2763cda67a786adb1-2',
      asset: 'XUSD',
      amount: '500000000000000000000',
      user: '0x0123aaaaaaaa',
      event: IEvent.Deposit,
      txHash: '0x01',
      receiver: '0000',
      date: '1624006551',
      txHash: '0x00',
    },
    {
      id: '0x02c832f62c5f9bc36aff106641080bd1aea154b37347b2ab5ada80b29dd7e253-6',
      event: IEvent.Deposit,
      txHash: '0x01',
      receiver: '0000',
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
  arr1: Array<TransactionsTableItem>,
  arr2: Array<TransactionsQueryItem>
): TransactionsTableItem[] =>
  arr1.filter((tx) => !arr2.find((ptx) => ptx.txHash === tx.txHash));
