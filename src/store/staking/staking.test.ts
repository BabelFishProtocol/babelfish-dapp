import { BigNumber, constants } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { pick } from '../../utils/helpers';
import { Reducers } from '../../constants';
import {
  ERC20__factory,
  Staking,
  Vesting__factory,
} from '../../contracts/types';
import { Staking__factory } from '../../contracts/types/factories/Staking__factory';
import { VestingRegistry__factory } from '../../contracts/types/factories/VestingRegistry__factory';
import { rootReducer, RootState } from '..';

import {
  createMockedContract,
  mockSigner,
  mockProvider,
} from '../../testUtils';

import {
  accountSelector,
  fishTokenSelector,
  providerSelector,
  stakingContractSelector,
  vestingRegistrySelector,
} from '../app/app.selectors';

import {
  fetchStakeConstants,
  fetchFishTokenData,
  fetchVotingPower,
  fetchStakesList,
  fetchVestsList,
} from './staking.sagas';
import { stakingActions } from './staking.slice';
import { StakeListItem, StakingState, VestListItem } from './staking.state';

const getVestingResult = '0x94e907f6B903A393E14FE549113137CA6483b5ef';

const mockVestingFactoryConnect = Vesting__factory.connect(
  getVestingResult,
  mockSigner
);

jest.mock('./staking.utils', () => ({
  ...jest.requireActual('./staking.utils'),
  getVesting: jest.fn(() => mockVestingFactoryConnect),
}));

const mockStaking = createMockedContract(
  Staking__factory.connect(constants.AddressZero, mockSigner),
  true
);

const mockFishToken = createMockedContract(
  ERC20__factory.connect(constants.AddressZero, mockSigner),
  true
);
const mockVestingRegistry = createMockedContract(
  VestingRegistry__factory.connect(constants.AddressZero, mockSigner),
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

  describe('fetchFishTokenData', () => {
    const totalStaked = '55566456546';
    const fishBalance = '232347482374623';
    const allowanceForStaking = '1000000';

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
        .select(fishTokenSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(fishTokenSelector), mockFishToken],
          [
            matchers.call.fn(mockStaking.balanceOf),
            BigNumber.from(totalStaked),
          ],
          [
            matchers.call.fn(mockFishToken.allowance),
            BigNumber.from(allowanceForStaking),
          ],
          [
            matchers.call.fn(mockFishToken.balanceOf),
            BigNumber.from(fishBalance),
          ],
        ])
        .call(mockStaking.balanceOf, testAccount)
        .call(mockFishToken.balanceOf, testAccount)
        .call(mockFishToken.allowance, testAccount, mockStaking.address)
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
          [matchers.select(stakingContractSelector), undefined],
        ])
        .put(stakingActions.fetchFishTokenDataFailure())
        .hasFinalState(failureState)
        .run();

      expect(mockStaking.balanceOf).not.toHaveBeenCalled();
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(fishTokenSelector), mockFishToken],
          [matchers.call.fn(mockStaking.balanceOf), throwError()],
        ])
        .call(mockStaking.balanceOf, testAccount)
        .put(stakingActions.fetchFishTokenDataFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('fetchStakeConstants', () => {
    const kickoffTS = 435767887;
    const WEIGHT_FACTOR = '1000';

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        constants: {
          data: { kickoffTs: kickoffTS, WEIGHT_FACTOR },
          state: 'success',
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        constants: { state: 'failure', data: {} },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchStakeConstants)
        .withReducer(reducer)
        .withState(initialState)
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
        .put(
          stakingActions.setConstants({ WEIGHT_FACTOR, kickoffTs: kickoffTS })
        )
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
  describe('fetchVestsList', () => {
    const stakes = ['100000', '150000'];
    const dates = [BigNumber.from(1645564671), BigNumber.from(1645564672)];
    const delegates = ['0x3443'];
    const cliff = BigNumber.from(2419200);

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
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        vestsList: { state: 'success', data: combinedVestsList },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        vestsList: { state: 'failure', data: [] },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchVestsList)
        .withReducer(reducer)
        .withState(initialState)
        .select(accountSelector)
        .select(vestingRegistrySelector)
        .select(stakingContractSelector)
        .select(providerSelector);

    it('happy path', async () => {
      await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(vestingRegistrySelector), mockVestingRegistry],
          [matchers.select(providerSelector), mockProvider],
          [matchers.call.fn(mockVestingRegistry.getVesting), getVestingResult],
          [
            matchers.call.fn(mockVestingRegistry.getTeamVesting),
            constants.AddressZero,
          ],
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
        .put(stakingActions.setVestsList(combinedVestsList))
        .hasFinalState(successState)
        .run();
    });

    it('when wallet is not connected', async () => {
      await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(providerSelector), mockProvider],
          [matchers.select(vestingRegistrySelector), undefined],
        ])
        .put(stakingActions.fetchVestsListFailure())
        .hasFinalState(failureState)
        .run();

      expect(mockVestingRegistry.getVesting).not.toHaveBeenCalled();
      expect(mockVestingRegistry.getTeamVesting).not.toHaveBeenCalled();
    });

    it('fetching error', async () => {
      await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(vestingRegistrySelector), mockVestingRegistry],
          [matchers.select(providerSelector), mockProvider],
          [matchers.call.fn(mockVestingRegistry.getVesting), throwError()],
        ])
        .call(mockVestingRegistry.getVesting, testAccount)
        .put(stakingActions.fetchVestsListFailure())
        .hasFinalState(failureState)
        .run();
    });
  });
});
