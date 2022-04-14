import * as matchers from 'redux-saga-test-plan/matchers';
import { DeepPartial } from '@reduxjs/toolkit';
import { expectSaga } from 'redux-saga-test-plan';
import { BigNumber } from 'ethers';
import { throwError } from 'redux-saga-test-plan/providers';
import { RootState } from '../..';
import {
  stakingInitialState,
  mockStaking,
  stakingReducer,
  testAccount,
  votingPower,
} from '../staking.mock';
import { Reducers } from '../../../constants';
import { fetchVotingPower } from './fetchVotingPower';
import {
  accountSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import { stakingActions } from '../staking.slice';

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchVotingPower', () => {
  const successState: DeepPartial<RootState> = {
    ...stakingInitialState,
    [Reducers.Staking]: {
      ...stakingInitialState[Reducers.Staking],
      combinedVotingPower: { state: 'success', data: votingPower },
    },
  };

  const failureState: DeepPartial<RootState> = {
    ...stakingInitialState,
    [Reducers.Staking]: {
      ...stakingInitialState[Reducers.Staking],
      combinedVotingPower: { state: 'failure', data: undefined },
    },
  };

  const getBasePath = () =>
    expectSaga(fetchVotingPower)
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .select(accountSelector)
      .select(stakingContractSelector);

  it('happy path', async () => {
    const runResult = await getBasePath()
      .provide([
        [matchers.select(accountSelector), testAccount],
        [matchers.select(stakingContractSelector), mockStaking],
        [
          matchers.call.fn(mockStaking.getCurrentVotes),
          BigNumber.from(votingPower),
        ],
      ])
      .call(mockStaking.getCurrentVotes, testAccount)
      .put(stakingActions.setVotingPower(votingPower))
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
      .put(stakingActions.fetchVotingPowerFailure())
      .hasFinalState(failureState)
      .run();

    expect(mockStaking.getCurrentVotes).not.toHaveBeenCalled();
  });

  it('fetching error', async () => {
    const runResult = await getBasePath()
      .provide([
        [matchers.select(accountSelector), testAccount],
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.call.fn(mockStaking.getCurrentVotes), throwError()],
      ])
      .call(mockStaking.getCurrentVotes, testAccount)
      .put(stakingActions.fetchVotingPowerFailure())
      .hasFinalState(failureState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
