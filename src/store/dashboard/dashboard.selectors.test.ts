import { DashboardState } from './dashboard.state';
import {
  fetchedTransactionsSelector,
  fishBalanceSelector,
  totalFishSelector,
  transactionsSelector,
  xusdBalanceSelector,
} from './dashboard.selectors';
import { TransactionsTableItem } from '../../pages/Dashboard/TransactionsTable/TransactionsTable.types';
import { XusdLocalTransaction } from '../aggregator/aggregator.state';

afterEach(() => {
  jest.clearAllMocks();
});

describe('dashboard selectors', () => {
  it('fishBalanceSelector', () => {
    const filledBalances: DashboardState['balances'] = {
      state: 'success',
      data: { fishBalance: '123', totalFish: '200', xusdBalance: '300' },
    };

    const filledDataResult = fishBalanceSelector.resultFunc(filledBalances);

    expect(filledDataResult).toEqual({
      state: filledBalances.state,
      data: filledBalances.data?.fishBalance,
    });

    const failureBalances: DashboardState['balances'] = {
      state: 'failure',
      data: undefined,
    };

    const failureDataResult = fishBalanceSelector.resultFunc(failureBalances);

    expect(failureDataResult).toEqual({
      state: failureBalances.state,
      data: undefined,
    });
  });

  it('totalFishSelector', () => {
    const filledBalances: DashboardState['balances'] = {
      state: 'success',
      data: { fishBalance: '123', totalFish: '200', xusdBalance: '300' },
    };

    const filledDataResult = totalFishSelector.resultFunc(filledBalances);

    expect(filledDataResult).toEqual({
      state: filledBalances.state,
      data: filledBalances.data?.totalFish,
    });

    const loadingBalances: DashboardState['balances'] = {
      state: 'loading',
      data: undefined,
    };

    const failureDataResult = totalFishSelector.resultFunc(loadingBalances);

    expect(failureDataResult).toEqual({
      state: loadingBalances.state,
      data: undefined,
    });
  });

  it('xusdBalanceSelector', () => {
    const filledBalances: DashboardState['balances'] = {
      state: 'success',
      data: { fishBalance: '123', totalFish: '200', xusdBalance: '300' },
    };

    const filledDataResult = xusdBalanceSelector.resultFunc(filledBalances);

    expect(filledDataResult).toEqual({
      state: filledBalances.state,
      data: filledBalances.data?.xusdBalance,
    });

    const idleDashboardState: DashboardState['balances'] = {
      state: 'idle',
      data: undefined,
    };

    const failureDataResult =
      xusdBalanceSelector.resultFunc(idleDashboardState);

    expect(failureDataResult).toEqual({
      state: idleDashboardState.state,
      data: undefined,
    });
  });

  it('fetchedTransactionsSelector', () => {
    const transaction: TransactionsTableItem = {
      txHash: '0x4',
      asset: 'XUSD',
      date: '1653905641',
      amount: '7534',
      user: '0x6d66',
      event: 'Withdraw',
      status: 'Pending',
    };

    const transactionList: DashboardState['transactionList'] = {
      state: 'success',
      data: [transaction],
    };

    const filledState: DashboardState = {
      ...new DashboardState(),
      transactionList,
    };

    const filledDataResult =
      fetchedTransactionsSelector.resultFunc(filledState);

    expect(filledDataResult).toEqual(transactionList);
  });

  it('transactionsSelector with local tx', () => {
    const fetchedTransaction: TransactionsTableItem = {
      txHash: '0x411111',
      asset: 'XUSD',
      date: '1653905641',
      amount: '7534',
      user: '0x6d66',
      event: 'Withdraw',
      status: 'Confirmed',
    };

    const localXusdTransaction1: XusdLocalTransaction = {
      txHash: '0x422222',
      asset: 'XUSD',
      date: '1653905641',
      amount: '7534',
      user: '0x6d662222222',
      event: 'Withdraw',
      status: 'Pending',
    };

    const localXusdTransaction2: XusdLocalTransaction = {
      ...localXusdTransaction1,
      txHash: '0x00000',
    };

    const fetchedTransactionList: DashboardState['transactionList'] = {
      state: 'success',
      data: [fetchedTransaction],
    };

    const filledDataResult = transactionsSelector.resultFunc(
      fetchedTransactionList,
      [localXusdTransaction1, localXusdTransaction2]
    );

    expect(filledDataResult).toEqual({
      state: 'success',
      data: [localXusdTransaction1, localXusdTransaction2, fetchedTransaction],
    });
  });

  it('transactionsSelector without local tx', () => {
    const fetchedTransaction: TransactionsTableItem = {
      txHash: '0x411111',
      asset: 'XUSD',
      date: '1653905641',
      amount: '7534',
      user: '0x6d66',
      event: 'Withdraw',
      status: 'Confirmed',
    };

    const fetchedTransactionList: DashboardState['transactionList'] = {
      state: 'success',
      data: [fetchedTransaction],
    };

    const filledDataResult = transactionsSelector.resultFunc(
      fetchedTransactionList,
      undefined
    );

    expect(filledDataResult).toEqual({
      state: 'success',
      data: [fetchedTransaction],
    });
  });
});
