import * as matchers from 'redux-saga-test-plan/matchers';
import { DeepPartial } from '@reduxjs/toolkit';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
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
import { subgraphClientSelector } from '../../app/app.selectors';
import { stakesAndVestsAddressesSelector } from '../../vesting/vesting.selectors';
import { mockSubgraphClient } from '../../../testUtils';
import { historyStakesQuery } from '../../../queries/historyStakeListQuery';
import { stakingActions } from '../staking.slice';

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

  const addresses = [vestAddress, testAccount];

  const stakeEvents = [
    {
      id: 'stakeEvent-1',
      staker: testAccount,
      amount: stakes[0],
      lockedUntil: dates[0].toString(),
      totalStaked: stakes[0],
      transactionHash: txHashes[0],
    },
    {
      id: 'stakeEvent-2',
      staker: '0x05645644455',
      amount: stakes[0],
      lockedUntil: dates[0].toString(),
      totalStaked: stakes[0],
      transactionHash: txHashes[0],
    },
    {
      id: 'stakeEvent-3',
      staker: vestAddress,
      amount: stakes[0],
      lockedUntil: dates[1].toString(),
      totalStaked: stakes[1],
      transactionHash: txHashes[1],
    },
  ];

  const getBasePath = () =>
    expectSaga(fetchHistoryStaking)
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .select(subgraphClientSelector)
      .select(stakesAndVestsAddressesSelector);

  it('happy path', async () => {
    const runResult = await getBasePath()
      .provide([
        [matchers.select(subgraphClientSelector), mockSubgraphClient],
        [matchers.select(stakesAndVestsAddressesSelector), addresses],
        [
          matchers.call(historyStakesQuery, mockSubgraphClient, {
            contractAddresses: addresses,
          }),
          { stakeEvents: [stakeEvents[0], stakeEvents[2]] },
        ],
      ])
      .call(historyStakesQuery, mockSubgraphClient, {
        contractAddresses: addresses,
      })
      .put(stakingActions.setHistoryStakesList(combinedHistoryStakesList))
      .hasFinalState(successState)
      .run();

    expect(runResult.effects).toEqual({});
  });

  it('when wallet is not connected', async () => {
    const runResult = await getBasePath()
      .provide([
        [matchers.select(subgraphClientSelector), undefined],
        [matchers.select(stakesAndVestsAddressesSelector), undefined],
      ])
      .put(stakingActions.fetchHistoryStakesListFailure())
      .hasFinalState(failureState)
      .run();

    expect(runResult.effects).toEqual({});
  });

  it('fetching error', async () => {
    await getBasePath()
      .provide([
        [matchers.select(subgraphClientSelector), mockSubgraphClient],
        [matchers.select(stakesAndVestsAddressesSelector), addresses],
        [
          matchers.call(historyStakesQuery, mockSubgraphClient, {
            contractAddresses: addresses,
          }),
          throwError(),
        ],
      ])
      .call(historyStakesQuery, mockSubgraphClient, {
        contractAddresses: addresses,
      })
      .put(stakingActions.fetchHistoryStakesListFailure())
      .hasFinalState(failureState)
      .run();
  });
});
