import { DashboardState } from './dashboard.state';
import {
  fishBalanceSelector,
  totalFishSelector,
  xusdBalanceSelector,
} from './dashboard.selectors';

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
});
