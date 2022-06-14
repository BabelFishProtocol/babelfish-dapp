import { DeepPartial } from '@reduxjs/toolkit';
import { expectSaga } from 'redux-saga-test-plan';
import {
  combinedHistoryStakesList,
  dates,
  stakingInitialState,
  stakingReducer,
  stakes,
  testAccount,
  txHashes,
} from '../staking.mock';
import { RootState } from '../..';
import { Reducers } from '../../../constants';
import { fetchHistoryStaking } from './fetchHistoryStaking';
import { UserQueryResult } from '../../../queries/historyStakeListQuery';
import { stakingActions } from '../staking.slice';
import { IStakeEvent } from '../../../gql/graphql';

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchHistoryStaking', () => {
  const successState: DeepPartial<RootState> = {
    ...stakingInitialState,
    [Reducers.Staking]: {
      ...stakingInitialState[Reducers.Staking],
      stakesListHistory: {
        state: 'success',
        data: combinedHistoryStakesList,
      },
    },
  };

  const failureState: DeepPartial<RootState> = {
    ...stakingInitialState,
    [Reducers.Staking]: {
      ...stakingInitialState[Reducers.Staking],
      stakesListHistory: { state: 'failure', data: [] },
    },
  };

  const vestAddress = '0x94e907A6483b5ef';

  const stakeEvents: IStakeEvent[] = [
    {
      id: 'stakeEvent-1',
      staker: testAccount,
      amount: stakes[0],
      lockedUntil: dates[0].toString(),
      totalStaked: stakes[0],
      transactionHash: txHashes[0],
      blockTimestamp: dates[0].toString(),
    },
    {
      id: 'stakeEvent-2',
      staker: '0x05645644455',
      amount: stakes[0],
      lockedUntil: dates[0].toString(),
      totalStaked: stakes[0],
      transactionHash: txHashes[0],
      blockTimestamp: dates[1].toString(),
    },
    {
      id: 'stakeEvent-3',
      staker: vestAddress,
      amount: stakes[0],
      lockedUntil: dates[1].toString(),
      totalStaked: stakes[1],
      transactionHash: txHashes[1],
      blockTimestamp: dates[1].toString(),
    },
  ];

  const result: UserQueryResult = {
    user: {
      id: 'test',
      allStakes: [stakeEvents[0], stakeEvents[2]],
    },
  };

  it('happy path', async () => {
    const runResult = await expectSaga(fetchHistoryStaking, {
      data: result,
      isError: false,
    })
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .put(stakingActions.fetchHistoryStakesList())
      .put(stakingActions.setHistoryStakesList(combinedHistoryStakesList))
      .hasFinalState(successState)
      .run();

    expect(runResult.effects).toEqual({});
  });

  it('fetching error', async () => {
    const runResult = await expectSaga(fetchHistoryStaking, {
      error: new Error('query error'),
      isError: true,
    })
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .put(stakingActions.fetchHistoryStakesList())
      .put(stakingActions.fetchHistoryStakesListFailure())
      .hasFinalState(failureState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
