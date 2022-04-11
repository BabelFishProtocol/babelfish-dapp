import { BigNumber, constants } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { pick } from '../../../utils/helpers';
import { Reducers } from '../../../constants';
import {
  Staking,
  Staking__factory,
  Vesting__factory,
} from '../../../contracts/types';
import { rootReducer, RootState } from '../..';

import {
  createMockedContract,
  mockSigner,
  mockProvider,
} from '../../../testUtils';

import {
  accountSelector,
  providerSelector,
  stakingContractSelector,
} from '../../app/app.selectors';

import { vestingActions } from '../vesting.slice';
import { UserVestings } from '../vesting.types';
import { getUserVestings } from '../vesting.utils';
import { VestingState } from '../vesting.state';
import { fetchVestsList } from './fetchVestsList';
import {
  accountAddress,
  cliff,
  combinedVestsList,
  dates,
  delegates,
  stakes,
  vestingAddress,
} from '../vesting.mock';

const mockVestingFactoryConnect = Vesting__factory.connect(
  vestingAddress,
  mockSigner
);

jest.mock('../vesting.utils', () => ({
  ...jest.requireActual('../vesting.utils'),
  getVesting: jest.fn(() => mockVestingFactoryConnect),
}));

const mockStaking = createMockedContract(
  Staking__factory.connect(constants.AddressZero, mockSigner),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

const reducer = combineReducers(pick(rootReducer, [Reducers.Vesting]));

const initialState: DeepPartial<RootState> = {
  [Reducers.Vesting]: { ...new VestingState() },
};

const getStakesResult: Partial<Awaited<ReturnType<Staking['getStakes']>>> = {
  dates: dates.map((date) => BigNumber.from(date)),
  stakes: stakes.map((stake) => BigNumber.from(stake)),
};

const userVests: UserVestings = {
  vestAddress: vestingAddress,
  teamVestAddress: constants.AddressZero,
};

describe('fetchVestsList', () => {
  const successState: DeepPartial<RootState> = {
    ...initialState,
    [Reducers.Vesting]: {
      ...initialState[Reducers.Vesting],
      vestsList: { state: 'success', data: [combinedVestsList[0]] },
    },
  };

  const failureState: DeepPartial<RootState> = {
    ...initialState,
    [Reducers.Vesting]: {
      ...initialState[Reducers.Vesting],
      vestsList: { state: 'failure', data: [] },
    },
  };

  const getBasePath = () =>
    expectSaga(fetchVestsList)
      .withReducer(reducer)
      .withState(initialState)
      .select(accountSelector)
      .select(stakingContractSelector)
      .select(providerSelector);

  it('happy path', async () => {
    await getBasePath()
      .provide([
        [matchers.select(accountSelector), accountAddress],
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(providerSelector), mockProvider],
        [matchers.call(getUserVestings), userVests],
        [matchers.call(mockStaking.getStakes, vestingAddress), getStakesResult],
        [matchers.call(mockStaking.balanceOf, vestingAddress), stakes[0]],
        [
          matchers.call(
            mockStaking.delegates,
            vestingAddress,
            dates[0].toNumber()
          ),
          delegates[0],
        ],
        [matchers.call(mockVestingFactoryConnect.startDate), dates[0]],
        [matchers.call(mockVestingFactoryConnect.endDate), dates[0]],
        [matchers.call(mockVestingFactoryConnect.cliff), cliff],
      ])
      .put(vestingActions.setVestsList([combinedVestsList[0]]))
      .hasFinalState(successState)
      .run();
  });

  it('when wallet is not connected', async () => {
    const runResult = await getBasePath()
      .provide([
        [matchers.select(accountSelector), accountAddress],
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(providerSelector), undefined],
      ])
      .put(vestingActions.fetchVestsListFailure())
      .hasFinalState(failureState)
      .run();

    expect(runResult.effects).toEqual({});
  });

  it('fetching error', async () => {
    await getBasePath()
      .provide([
        [matchers.select(accountSelector), accountAddress],
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(providerSelector), mockProvider],
        [matchers.call.fn(getUserVestings), throwError()],
      ])
      .call(getUserVestings)
      .put(vestingActions.fetchVestsListFailure())
      .hasFinalState(failureState)
      .run();
  });
});
