import { TransactionsQueryResult } from '../../../queries/transactionsQuery';

export const expectedTransactions: TransactionsQueryResult = {
  xusdTransactions: [
    {
      id: '0x005c02ef6218988d39045ef3c11efdd4133b72754ad6eba2763cda67a786adb1-2',
      event: 'Deposit',
      asset: 'XUSD',
      amount: '500000000000000000000',
      user: '0x0123aaaaaaaa',
      date: '1624006551',
      txHash: '0x0',
    },
    {
      id: '0x02c832f62c5f9bc36aff106641080bd1aea154b37347b2ab5ada80b29dd7e253-6',
      event: 'Deposit',
      asset: 'XUSD',
      amount: '49500000000000000000',
      user: '0x0123',
      date: '1636084223',
      txHash: '0x1',
    },
  ],
};
