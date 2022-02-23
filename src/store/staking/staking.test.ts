import { BigNumber, constants } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { pick } from '../../utils/helpers';
import { Reducers } from '../../constants';
import { Staking__factory } from '../../contracts/types/factories/Staking__factory';
import { rootReducer, RootState } from '..';

import { createMockedContract, mockSigner } from '../../testUtils';

import { accountSelector, stakingContractSelector } from '../app/app.selectors';

import {
  fetchKickoffTs,
  fetchTotalStaked,
  fetchVotingPower,
} from './staking.sagas';
import { StakingState } from './staking.state';
import { stakingActions } from './staking.slice';

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

      expect(mockStaking.balanceOf).not.toHaveBeenCalled();
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
});
