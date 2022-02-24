import { BigNumber, constants } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { pick } from '../../utils/helpers';
import { Reducers } from '../../constants';
import { Staking } from '../../contracts/types';
import { Staking__factory } from '../../contracts/types/factories/Staking__factory';
import { rootReducer, RootState } from '..';

import { createMockedContract, mockSigner } from '../../testUtils';

import { accountSelector, stakingContractSelector } from '../app/app.selectors';

import {
  fetchKickoffTs,
  fetchTotalStaked,
  fetchVotingPower,
  fetchStakesList,
} from './staking.sagas';
import { stakingActions } from './staking.slice';
import { StakeListItem, StakingState } from './staking.state';

const mockStaking = createMockedContract(
  Staking__factory.connect(constants.AddressZero, mockSigner),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('staking store', () => {
  const testAccount = '0x0123';
  const reducer = combineReducers(pick(rootReducer, [Reducers.Staking]));

  const initialState: DeepPartial<RootState> = {
    [Reducers.Staking]: { ...new StakingState() },
  };

  describe('fetchTotalStaked', () => {
    const totalStaked = '55566456546';

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        totalStaked: { state: 'success', data: totalStaked },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        totalStaked: { state: 'failure', data: undefined },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchTotalStaked)
        .withReducer(reducer)
        .withState(initialState)
        .select(accountSelector)
        .select(stakingContractSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [
            matchers.call.fn(mockStaking.balanceOf),
            BigNumber.from(totalStaked),
          ],
        ])
        .call(mockStaking.balanceOf, testAccount)
        .put(stakingActions.setTotalStaked(totalStaked))
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
        .put(stakingActions.fetchTotalStakedFailure())
        .hasFinalState(failureState)
        .run();

      expect(mockStaking.balanceOf).not.toHaveBeenCalled();
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.call.fn(mockStaking.balanceOf), throwError()],
        ])
        .call(mockStaking.balanceOf, testAccount)
        .put(stakingActions.fetchTotalStakedFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('fetchKickoffTs', () => {
    const kickoffTS = 435767887;

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        kickoffTs: { state: 'success', data: kickoffTS },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        kickoffTs: { state: 'failure', data: undefined },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchKickoffTs)
        .withReducer(reducer)
        .withState(initialState)
        .select(stakingContractSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.call.fn(mockStaking.kickoffTS), BigNumber.from(kickoffTS)],
        ])
        .call(mockStaking.kickoffTS)
        .put(stakingActions.setKickoffTs(kickoffTS))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      await getBasePath()
        .provide([[matchers.select(stakingContractSelector), undefined]])
        .put(stakingActions.fetchKickoffTsFailure())
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
        .put(stakingActions.fetchKickoffTsFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('fetchVotingPower', () => {
    const votingPower = '55566456546';

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        combinedVotingPower: { state: 'success', data: votingPower },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        combinedVotingPower: { state: 'failure', data: undefined },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchVotingPower)
        .withReducer(reducer)
        .withState(initialState)
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

  describe('fetchStakesList', () => {
    const stakes = ['100000', '150000'];
    const dates = [1645564671, 1645564672];
    const delegates = ['0x0000', '0x3443'];

    const getStakesResult: Partial<Awaited<ReturnType<Staking['getStakes']>>> =
      {
        dates: dates.map((date) => BigNumber.from(date)),
        stakes: stakes.map((stake) => BigNumber.from(stake)),
      };

    const combinedStakesList: StakeListItem[] = [
      {
        asset: 'FISH',
        unlockDate: dates[0],
        lockedAmount: stakes[0],
        votingDelegation: delegates[0],
      },
      {
        asset: 'FISH',
        unlockDate: dates[1],
        lockedAmount: stakes[1],
        votingDelegation: delegates[1],
      },
    ];

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
});
