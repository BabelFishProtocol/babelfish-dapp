import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';
import { BaseContract, BigNumber, constants } from 'ethers';

import { pick } from '../../../utils/helpers';
import { Reducers } from '../../../constants';
import { convertForMulticall } from '../../utils/utils.sagas';
import { rootReducer, RootState } from '../..';
import { ERC20__factory, Staking__factory } from '../../../contracts/types';

import {
  mockSigner,
  createMockedContract,
  mockMulticallProvider,
} from '../../../testUtils';

import {
  accountSelector,
  fishTokenSelector,
  multicallProviderSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import { getUserVestings } from '../../vesting/vesting.utils';
import { UserVestings } from '../../vesting/vesting.types';

import { dashboardActions } from '../dashboard.slice';
import { DashboardBalances, DashboardState } from '../dashboard.state';
import { xusdTokenSelector } from '../dashboard.selectors';
import {
  fetchDashboardBalances,
  getVestBalance,
} from './fetchDashboardBalances';

jest.mock('../../utils/utils.sagas', () => ({
  ...jest.requireActual('../../utils/utils.sagas'),
  convertForMulticall: jest.fn(),
}));

const stakingAddress = '0x0000000000000000000000000000000000000123';
const mockStaking = createMockedContract(
  Staking__factory.connect(stakingAddress, mockSigner),
  true
);

const fishTokenAddress = '0x0000000000000000000000000000000000001234';
const mockFishToken = createMockedContract(
  ERC20__factory.connect(fishTokenAddress, mockSigner),
  true
);

const xusdTokenAddress = '0x0000000000000000000000000000000000001234';
const mockXUSDToken = createMockedContract(
  ERC20__factory.connect(xusdTokenAddress, mockSigner),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('dashboard store', () => {
  const reducer = combineReducers(pick(rootReducer, [Reducers.Dashboard]));

  const initialState: DeepPartial<RootState> = {
    [Reducers.Dashboard]: { ...new DashboardState() },
  };

  describe('fetchDashboardBalances', () => {
    const mockConvertForMulticall = (contract: BaseContract, method: string) =>
      `${contract.address}_${method}`;

    (convertForMulticall as jest.Mock).mockImplementation(
      mockConvertForMulticall
    );

    const fishStakedCall = mockConvertForMulticall(mockStaking, 'balanceOf');
    const fishBalanceCall = mockConvertForMulticall(mockFishToken, 'balanceOf');
    const xusdBalanceCall = mockConvertForMulticall(mockFishToken, 'balanceOf');

    const userAccount = '0x0000000000000000000000000000000000000001';

    const fishBalance = '100000000';
    const fishStaked = '100000000';
    const totalFish = '400000000';
    const vestBalance = '100000000';
    const teamVestBalance = '100000000';
    const xusdBalance = '7000000000';

    const userVests: UserVestings = {
      vestAddress: '0x100',
      teamVestAddress: '0x101',
    };

    const expectedBalances: DashboardBalances = {
      fishBalance,
      totalFish,
      xusdBalance,
    };

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Dashboard]: {
        ...initialState[Reducers.Dashboard],
        balances: {
          state: 'success',
          data: expectedBalances,
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Dashboard]: {
        ...initialState[Reducers.Dashboard],
        balances: { state: 'failure', data: undefined },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchDashboardBalances)
        .withReducer(reducer)
        .withState(initialState)
        .select(accountSelector)
        .select(stakingContractSelector)
        .select(fishTokenSelector)
        .select(xusdTokenSelector)
        .select(multicallProviderSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), userAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(fishTokenSelector), mockFishToken],
          [matchers.select(xusdTokenSelector), mockXUSDToken],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.call(getUserVestings), userVests],
          [
            matchers.call(getVestBalance, mockStaking, userVests.vestAddress),
            BigNumber.from(vestBalance),
          ],
          [
            matchers.call(
              getVestBalance,
              mockStaking,
              userVests.teamVestAddress
            ),
            BigNumber.from(teamVestBalance),
          ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [fishStakedCall, fishBalanceCall, xusdBalanceCall]
            ),
            [
              BigNumber.from(fishStaked),
              BigNumber.from(fishBalance),
              BigNumber.from(xusdBalance),
            ],
          ],
        ])
        .call(getUserVestings)
        .call(getVestBalance, mockStaking, userVests.vestAddress)
        .call(getVestBalance, mockStaking, userVests.teamVestAddress)
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [fishStakedCall, fishBalanceCall, xusdBalanceCall]
        )
        .put(dashboardActions.setBalances(expectedBalances))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), undefined],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(fishTokenSelector), mockFishToken],
          [matchers.select(xusdTokenSelector), mockXUSDToken],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.call(getUserVestings), userVests],
        ])
        .put(dashboardActions.fetchBalancesFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), userAccount],
          [matchers.select(stakingContractSelector), mockStaking],
          [matchers.select(fishTokenSelector), mockFishToken],
          [matchers.select(xusdTokenSelector), mockXUSDToken],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.call(getUserVestings), throwError()],
          [
            matchers.call(getVestBalance, mockStaking, userVests.vestAddress),
            BigNumber.from(vestBalance),
          ],
          [
            matchers.call(
              getVestBalance,
              mockStaking,
              userVests.teamVestAddress
            ),
            BigNumber.from(teamVestBalance),
          ],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [fishStakedCall, fishBalanceCall, xusdBalanceCall]
            ),
            [
              BigNumber.from(fishStaked),
              BigNumber.from(fishBalance),
              BigNumber.from(xusdBalance),
            ],
          ],
        ])
        .call(getUserVestings)

        .put(dashboardActions.fetchBalancesFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('getVestBalance', () => {
    it('returns proper amount', async () => {
      const vestAddress = '0x0123';
      const vestBalance = BigNumber.from('12312313123');

      const runResult = await expectSaga(
        getVestBalance,
        mockStaking,
        vestAddress
      )
        .provide([
          [matchers.call(mockStaking.balanceOf, vestAddress), vestBalance],
        ])
        .call(mockStaking.balanceOf, vestAddress)
        .run();

      expect(runResult.effects).toEqual({});
      expect(runResult.returnValue).toEqual(vestBalance);
    });

    it('returns 0 in case user does not have the vesting contract', async () => {
      const runResult = await expectSaga(
        getVestBalance,
        mockStaking,
        constants.AddressZero
      ).run();

      expect(runResult.effects).toEqual({});
      expect(runResult.returnValue).toEqual(BigNumber.from(0));
    });
  });
});
