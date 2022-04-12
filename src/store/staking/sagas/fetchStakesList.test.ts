import { DeepPartial } from '@reduxjs/toolkit';
import * as matchers from 'redux-saga-test-plan/matchers';
import { BigNumber } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { RootState } from '../..';
import { Reducers } from '../../../constants';
import { Staking } from '../../../contracts/types';
import {
  accountSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import {
  combinedStakesList,
  dates,
  delegates,
  initialState,
  mockStaking,
  reducer,
  stakes,
  testAccount,
} from '../staking.mock';
import { stakingActions } from '../staking.slice';
import { fetchStakesList } from './fetchStakesList';

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchStakesList', () => {
  const getStakesResult: Partial<Awaited<ReturnType<Staking['getStakes']>>> = {
    dates: dates.map((date) => BigNumber.from(date)),
    stakes: stakes.map((stake) => BigNumber.from(stake)),
  };

  const successState: DeepPartial<RootState> = {
    ...initialState,
    [Reducers.Staking]: {
      ...initialState[Reducers.Staking],
      stakesList: { state: 'success', data: combinedStakesList },
    },
  };

  const failureState: DeepPartial<RootState> = {
    ...initialState,
    [Reducers.Staking]: {
      ...initialState[Reducers.Staking],
      stakesList: { state: 'failure', data: [] },
    },
  };

  const getBasePath = () =>
    expectSaga(fetchStakesList)
      .withReducer(reducer)
      .withState(initialState)
      .select(accountSelector)
      .select(stakingContractSelector);

  it('happy path', async () => {
    const runResult = await getBasePath()
      .provide([
        [matchers.select(accountSelector), testAccount],
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.call.fn(mockStaking.getStakes), getStakesResult],
        [
          matchers.call(mockStaking.delegates, testAccount, dates[0]),
          delegates[0],
        ],
        [
          matchers.call(mockStaking.delegates, testAccount, dates[1]),
          delegates[1],
        ],
      ])
      .call(mockStaking.getStakes, testAccount)
      .call(mockStaking.delegates, testAccount, dates[0])
      .call(mockStaking.delegates, testAccount, dates[1])
      .put(stakingActions.setStakesList(combinedStakesList))
      .hasFinalState(successState)
      .run();
    expect(runResult.effects).toEqual({});
  });

  it('when wallet is not connected', async () => {
    await getBasePath()
      .provide([
        [matchers.select(accountSelector), testAccount],
        [matchers.select(stakingContractSelector), undefined],
      ])
      .put(stakingActions.fetchStakesListFailure())
      .hasFinalState(failureState)
      .run();

    expect(mockStaking.getStakes).not.toHaveBeenCalled();
    expect(mockStaking.delegate).not.toHaveBeenCalled();
  });

  it('fetching error', async () => {
    const runResult = await getBasePath()
      .provide([
        [matchers.select(accountSelector), testAccount],
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.call.fn(mockStaking.getStakes), throwError()],
      ])
      .call(mockStaking.getStakes, testAccount)
      .put(stakingActions.fetchStakesListFailure())
      .hasFinalState(failureState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
