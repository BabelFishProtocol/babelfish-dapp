import { BigNumber, constants } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { pick } from '../../utils/helpers';
import { Reducers } from '../../constants';
import { Staking, Vesting__factory } from '../../contracts/types';
import { Staking__factory } from '../../contracts/types/factories/Staking__factory';
import { rootReducer, RootState } from '..';

import {
  createMockedContract,
  mockSigner,
  mockProvider,
} from '../../testUtils';

import {
  accountSelector,
  providerSelector,
  stakingContractSelector,
} from '../app/app.selectors';

import { fetchVestsList } from './vesting.sagas';
import { vestingActions } from './vesting.slice';
import { UserVestings } from './vesting.types';
import { getUserVestings } from './vesting.utils';
import { VestingState, VestListItem } from './vesting.state';

const getVestingResult = '0x94e907f6B903A393E14FE549113137CA6483b5ef';

const mockVestingFactoryConnect = Vesting__factory.connect(
  getVestingResult,
  mockSigner
);

jest.mock('./vesting.utils', () => ({
  ...jest.requireActual('./vesting.utils'),
  getVesting: jest.fn(() => mockVestingFactoryConnect),
}));

const mockStaking = createMockedContract(
  Staking__factory.connect(constants.AddressZero, mockSigner),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('vesting store', () => {
  const testAccount = '0x0123';
  const reducer = combineReducers(pick(rootReducer, [Reducers.Vesting]));

  const initialState: DeepPartial<RootState> = {
    [Reducers.Vesting]: { ...new VestingState() },
  };

  describe('fetchVestsList', () => {
    const stakes = ['100000', '150000'];
    const dates = [BigNumber.from(1645564671), BigNumber.from(1645564672)];
    const delegates = ['0x3443'];
    const cliff = BigNumber.from(2419200);

    const userVests: UserVestings = {
      vestAddress: getVestingResult,
      teamVestAddress: constants.AddressZero,
    };

    const getStakesResult: Partial<Awaited<ReturnType<Staking['getStakes']>>> =
      {
        dates: dates.map((date) => BigNumber.from(date)),
        stakes: stakes.map((stake) => BigNumber.from(stake)),
      };

    const combinedVestsList: VestListItem[] = [
      {
        asset: 'FISH',
        unlockDate: dates[0].toNumber(),
        lockedAmount: stakes[0],
        votingDelegation: delegates[0],
        stakingPeriodStart: dates[0].toNumber(),
        address: getVestingResult,
        addressType: 'genesis',
        cliff: cliff.toNumber(),
      },
    ];

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Vesting]: {
        ...initialState[Reducers.Vesting],
        vestsList: { state: 'success', data: combinedVestsList },
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
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(providerSelector), mockProvider],
          [matchers.call(getUserVestings), userVests],
          [
            matchers.call(mockStaking.getStakes, getVestingResult),
            getStakesResult,
          ],
          [matchers.call(mockStaking.balanceOf, getVestingResult), stakes[0]],
          [
            matchers.call(
              mockStaking.delegates,
              getVestingResult,
              dates[0].toNumber()
            ),
            delegates[0],
          ],
          [matchers.call(mockVestingFactoryConnect.startDate), dates[0]],
          [matchers.call(mockVestingFactoryConnect.endDate), dates[0]],
          [matchers.call(mockVestingFactoryConnect.cliff), cliff],
        ])
        .put(vestingActions.setVestsList(combinedVestsList))
        .hasFinalState(successState)
        .run();
    });

    it('when wallet is not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
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
          [matchers.select(accountSelector), testAccount],
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
});
