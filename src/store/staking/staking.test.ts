import { BigNumber, constants } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { pick } from '../../utils/helpers';
import { Reducers } from '../../constants';
import { ERC20__factory, Staking } from '../../contracts/types';
import { Staking__factory } from '../../contracts/types/factories/Staking__factory';
import { rootReducer, RootState } from '..';

import {
  createMockedContract,
  mockMulticallProvider,
  mockSigner,
  mockSubgraphClient,
} from '../../testUtils';

import {
  accountSelector,
  fishTokenSelector,
  multicallProviderSelector,
  stakingContractSelector,
  subgraphClientSelector,
} from '../app/app.selectors';

import {
  fetchStakeConstants,
  fetchFishTokenData,
  fetchVotingPower,
  fetchStakesList,
  fetchHistoryStaking,
} from './staking.sagas';
import { stakingActions } from './staking.slice';
import { StakeListItem, StakingState } from './staking.state';
import { StakingHistoryListItem } from '../../pages/Staking/StakingHistory/StakingHistory.types';
import { convertForMulticall } from '../utils/utils.sagas';
import { stakesAndVestsAddressesSelector } from '../vesting/vesting.selectors';
import { historyStakesQuery } from '../../queries/historyStakeListQuery';

jest.mock('../utils/utils.sagas', () => ({
  ...jest.requireActual('../utils/utils.sagas'),
  convertForMulticall: jest.fn(),
}));

const mockStaking = createMockedContract(
  Staking__factory.connect(constants.AddressZero, mockSigner),
  true
);

const mockFishToken = createMockedContract(
  ERC20__factory.connect(constants.AddressZero, mockSigner),
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

    const mockTotalStakedCall = {
      name: 'mocked args for totalStakedCall',
    };
    const mockTotalBalanceCall = {
      name: 'mocked args for totalBalanceCall',
    };
    const mockAllowanceForStakingCall = {
      name: 'mocked args for allowanceForStakingCall',
    };

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
        .select(fishTokenSelector)
        .select(multicallProviderSelector);

    it('happy path', async () => {
      (convertForMulticall as jest.Mock).mockImplementationOnce(
        () => mockTotalStakedCall
      );
      (convertForMulticall as jest.Mock).mockImplementationOnce(
        () => mockTotalBalanceCall
      );
      (convertForMulticall as jest.Mock).mockImplementationOnce(
        () => mockAllowanceForStakingCall
      );

      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(fishTokenSelector), mockFishToken],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [
                mockTotalStakedCall,
                mockTotalBalanceCall,
                mockAllowanceForStakingCall,
              ]
            ),
            [
              BigNumber.from(totalStaked),
              BigNumber.from(fishBalance),
              BigNumber.from(allowanceForStaking),
            ],
          ],
        ])
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [
            mockTotalStakedCall,
            mockTotalBalanceCall,
            mockAllowanceForStakingCall,
          ]
        )
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
          [matchers.select(fishTokenSelector), mockFishToken],
          [matchers.select(stakingContractSelector), undefined],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
        ])
        .put(stakingActions.fetchFishTokenDataFailure())
        .hasFinalState(failureState)
        .run();

      expect(mockMulticallProvider.all).not.toHaveBeenCalled();
    });

    it('fetching error', async () => {
      (convertForMulticall as jest.Mock).mockImplementationOnce(
        () => mockTotalStakedCall
      );
      (convertForMulticall as jest.Mock).mockImplementationOnce(
        () => mockTotalBalanceCall
      );
      (convertForMulticall as jest.Mock).mockImplementationOnce(
        () => mockAllowanceForStakingCall
      );

      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(fishTokenSelector), mockFishToken],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [
                mockTotalStakedCall,
                mockTotalBalanceCall,
                mockAllowanceForStakingCall,
              ]
            ),
            throwError(),
          ],
        ])
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [
            mockTotalStakedCall,
            mockTotalBalanceCall,
            mockAllowanceForStakingCall,
          ]
        )
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

  const stakes = ['100000', '150000'];
  const dates = [1645564671, 1645564672];
  const delegates = ['0x0000', '0x3443'];

  describe('fetchStakesList', () => {
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

    const getStakesResult: Partial<Awaited<ReturnType<Staking['getStakes']>>> =
      {
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

  describe('fetchHistoryStaking', () => {
    const txHashes = ['0x05644455', '0x3443'];

    const combinedHistoryStakesList: StakingHistoryListItem[] = [
      {
        asset: 'FISH',
        unlockDate: dates[0].toString(),
        stakedAmount: stakes[0],
        totalStaked: stakes[0],
        txHash: txHashes[0],
      },
      {
        asset: 'FISH',
        unlockDate: dates[1].toString(),
        stakedAmount: stakes[0],
        totalStaked: stakes[1],
        txHash: txHashes[1],
      },
    ];

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
        stakesListHistory: {
          state: 'success',
          data: combinedHistoryStakesList,
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Staking]: {
        ...initialState[Reducers.Staking],
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
        .withReducer(reducer)
        .withState(initialState)
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
});
