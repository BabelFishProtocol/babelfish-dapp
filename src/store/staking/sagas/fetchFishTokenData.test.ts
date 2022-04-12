import * as matchers from 'redux-saga-test-plan/matchers';
import { DeepPartial } from '@reduxjs/toolkit';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { BigNumber } from 'ethers';
import { RootState } from '../..';
import { Reducers } from '../../../constants';
import {
  accountSelector,
  fishTokenSelector,
  multicallProviderSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import { convertForMulticall } from '../../utils';
import {
  allowanceForStaking,
  fishBalance,
  initialState,
  mockFishToken,
  mockStaking,
  reducer,
  testAccount,
  totalStaked,
} from '../staking.mock';
import { fetchFishTokenData } from './fetchFishTokenData';
import { mockMulticallProvider } from '../../../testUtils';
import { stakingActions } from '../staking.slice';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  convertForMulticall: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchFishTokenData', () => {
  const mockTotalStakedCall = {
    name: 'mocked args for totalStakedCall',
  };
  const mockTotalBalanceCall = {
    name: 'mocked args for totalBalanceCall',
  };
  const mockAllowanceForStakingCall = {
    name: 'mocked args for allowanceForStakingCall',
  };

  const successState: DeepPartial<RootState> = {
    ...initialState,
    [Reducers.Staking]: {
      ...initialState[Reducers.Staking],
      fishToken: {
        state: 'success',
        data: { allowanceForStaking, fishBalance, totalStaked },
      },
    },
  };

  const failureState: DeepPartial<RootState> = {
    ...initialState,
    [Reducers.Staking]: {
      ...initialState[Reducers.Staking],
      fishToken: { state: 'failure', data: {} },
    },
  };

  const getBasePath = () =>
    expectSaga(fetchFishTokenData)
      .withReducer(reducer)
      .withState(initialState)
      .select(accountSelector)
      .select(stakingContractSelector)
      .select(fishTokenSelector)
      .select(multicallProviderSelector);

  it('happy path', async () => {
    (convertForMulticall as jest.Mock).mockImplementationOnce(
      () => mockTotalStakedCall
    );
    (convertForMulticall as jest.Mock).mockImplementationOnce(
      () => mockTotalBalanceCall
    );
    (convertForMulticall as jest.Mock).mockImplementationOnce(
      () => mockAllowanceForStakingCall
    );

    const runResult = await getBasePath()
      .provide([
        [matchers.select(accountSelector), testAccount],
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(fishTokenSelector), mockFishToken],
        [matchers.select(multicallProviderSelector), mockMulticallProvider],
        [
          matchers.call(
            [mockMulticallProvider, mockMulticallProvider.all],
            [
              mockTotalStakedCall,
              mockTotalBalanceCall,
              mockAllowanceForStakingCall,
            ]
          ),
          [
            BigNumber.from(totalStaked),
            BigNumber.from(fishBalance),
            BigNumber.from(allowanceForStaking),
          ],
        ],
      ])
      .call(
        [mockMulticallProvider, mockMulticallProvider.all],
        [mockTotalStakedCall, mockTotalBalanceCall, mockAllowanceForStakingCall]
      )
      .put(
        stakingActions.setFishTokenData({
          allowanceForStaking,
          fishBalance,
          totalStaked,
        })
      )
      .hasFinalState(successState)
      .run();

    expect(runResult.effects).toEqual({});
  });

  it('when wallet is not connected', async () => {
    await getBasePath()
      .provide([
        [matchers.select(accountSelector), testAccount],
        [matchers.select(fishTokenSelector), mockFishToken],
        [matchers.select(stakingContractSelector), undefined],
        [matchers.select(multicallProviderSelector), mockMulticallProvider],
      ])
      .put(stakingActions.fetchFishTokenDataFailure())
      .hasFinalState(failureState)
      .run();

    expect(mockMulticallProvider.all).not.toHaveBeenCalled();
  });

  it('fetching error', async () => {
    (convertForMulticall as jest.Mock).mockImplementationOnce(
      () => mockTotalStakedCall
    );
    (convertForMulticall as jest.Mock).mockImplementationOnce(
      () => mockTotalBalanceCall
    );
    (convertForMulticall as jest.Mock).mockImplementationOnce(
      () => mockAllowanceForStakingCall
    );

    const runResult = await getBasePath()
      .provide([
        [matchers.select(accountSelector), testAccount],
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(fishTokenSelector), mockFishToken],
        [matchers.select(multicallProviderSelector), mockMulticallProvider],
        [
          matchers.call(
            [mockMulticallProvider, mockMulticallProvider.all],
            [
              mockTotalStakedCall,
              mockTotalBalanceCall,
              mockAllowanceForStakingCall,
            ]
          ),
          throwError(),
        ],
      ])
      .call(
        [mockMulticallProvider, mockMulticallProvider.all],
        [mockTotalStakedCall, mockTotalBalanceCall, mockAllowanceForStakingCall]
      )
      .put(stakingActions.fetchFishTokenDataFailure())
      .hasFinalState(failureState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
