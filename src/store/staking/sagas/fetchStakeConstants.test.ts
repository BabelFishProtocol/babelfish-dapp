import * as matchers from 'redux-saga-test-plan/matchers';
import { DeepPartial } from '@reduxjs/toolkit';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { BigNumber } from 'ethers';
import { RootState } from '../..';
import {
  stakingInitialState,
  kickoffTS,
  mockStaking,
  stakingReducer,
  WEIGHT_FACTOR,
} from '../staking.mock';
import { Reducers } from '../../../constants';
import { fetchStakeConstants } from './fetchStakeConstants';
import { stakingContractSelector } from '../../app/app.selectors';
import { stakingActions } from '../staking.slice';

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchStakeConstants', () => {
  const successState: DeepPartial<RootState> = {
    ...stakingInitialState,
    [Reducers.Staking]: {
      ...stakingInitialState[Reducers.Staking],
      constants: {
        data: { kickoffTs: kickoffTS, WEIGHT_FACTOR },
        state: 'success',
      },
    },
  };

  const failureState: DeepPartial<RootState> = {
    ...stakingInitialState,
    [Reducers.Staking]: {
      ...stakingInitialState[Reducers.Staking],
      constants: { state: 'failure', data: {} },
    },
  };

  const getBasePath = () =>
    expectSaga(fetchStakeConstants)
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .select(stakingContractSelector);

  it('happy path', async () => {
    const runResult = await getBasePath()
      .provide([
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.call.fn(mockStaking.kickoffTS), BigNumber.from(kickoffTS)],
        [
          matchers.call.fn(mockStaking.WEIGHT_FACTOR),
          BigNumber.from(WEIGHT_FACTOR),
        ],
      ])
      .call(mockStaking.kickoffTS)
      .call(mockStaking.WEIGHT_FACTOR)
      .put(stakingActions.setConstants({ WEIGHT_FACTOR, kickoffTs: kickoffTS }))
      .hasFinalState(successState)
      .run();

    expect(runResult.effects).toEqual({});
  });

  it('when wallet is not connected', async () => {
    await getBasePath()
      .provide([[matchers.select(stakingContractSelector), undefined]])
      .put(stakingActions.fetchConstantsFailure())
      .hasFinalState(failureState)
      .run();

    expect(mockStaking.kickoffTS).not.toHaveBeenCalled();
  });

  it('fetching error', async () => {
    const runResult = await getBasePath()
      .provide([
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.call.fn(mockStaking.balanceOf), throwError()],
      ])
      .call(mockStaking.kickoffTS)
      .call(mockStaking.WEIGHT_FACTOR)
      .put(stakingActions.fetchConstantsFailure())
      .hasFinalState(failureState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
