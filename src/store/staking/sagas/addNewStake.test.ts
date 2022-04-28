import { constants, ContractTransaction, utils } from 'ethers';
import { DeepPartial } from '@reduxjs/toolkit';
import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { TransactionReceipt } from '@ethersproject/providers';

import { RootState } from '../..';
import { ONE_DAY, Reducers } from '../../../constants';

import {
  fishTokenSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import {
  mockStaking,
  mockFishToken,
  stakingReducer,
  stakingInitialState,
} from '../staking.mock';
import { stakingActions } from '../staking.slice';
import { fishTokenDataSelector } from '../staking.selectors';

import { addNewStake } from './addNewStake';

afterEach(() => {
  jest.clearAllMocks();
});

describe('addNewStake', () => {
  const mockApproveTx = {
    hash: '0x01',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockApproveReceipt = {
    transactionHash: '0x01',
  } as TransactionReceipt;

  const mockStakeTx = {
    hash: '0x02',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockStakeReceipt = {
    transactionHash: '0x02',
  } as TransactionReceipt;

  it('happy path', async () => {
    const expectedState: DeepPartial<RootState> = {
      ...stakingInitialState,
      [Reducers.Staking]: {
        ...stakingInitialState[Reducers.Staking],
        addNewStakeCall: {
          status: 'success',
          currentOperation: 'stake',
          steps: [
            {
              ...stakingInitialState[Reducers.Staking]?.addNewStakeCall
                ?.steps?.[0],
              tx: mockApproveTx,
              txReceipt: mockApproveReceipt,
            },
            {
              ...stakingInitialState[Reducers.Staking]?.addNewStakeCall
                ?.steps?.[1],
              tx: mockStakeTx,
              txReceipt: mockStakeReceipt,
            },
          ],
        },
      },
    };

    const stakeAmount = '100';
    const unlockDate = 100;

    await expectSaga(
      addNewStake,
      stakingActions.addNewStake({ unlockDate, stakeAmount })
    )
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .provide([
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(fishTokenSelector), mockFishToken],
        [matchers.select(fishTokenDataSelector), { allowanceForStaking: '0' }],

        [matchers.call.fn(mockFishToken.approve), mockApproveTx],
        [matchers.call.fn(mockApproveTx.wait), mockApproveReceipt],

        [matchers.call.fn(mockStaking.stake), mockStakeTx],
        [matchers.call.fn(mockStakeTx.wait), mockStakeReceipt],
      ])
      .select(stakingContractSelector)
      .select(fishTokenSelector)
      .select(fishTokenDataSelector)
      .call(
        mockFishToken.approve,
        mockStaking.address,
        utils.parseEther(stakeAmount)
      )
      .call(
        mockStaking.stake,
        utils.parseEther(stakeAmount),
        unlockDate + ONE_DAY,
        constants.AddressZero,
        constants.AddressZero
      )
      .hasFinalState(expectedState)
      .run();
  });

  it('when user allowance is sufficient', async () => {
    const expectedState: DeepPartial<RootState> = {
      ...stakingInitialState,
      [Reducers.Staking]: {
        ...stakingInitialState[Reducers.Staking],
        addNewStakeCall: {
          status: 'success',
          currentOperation: 'stake',
          steps: [
            {
              ...stakingInitialState[Reducers.Staking]?.addNewStakeCall
                ?.steps?.[1],
              tx: mockStakeTx,
              txReceipt: mockStakeReceipt,
            },
          ],
        },
      },
    };

    const stakeAmount = '100';
    const unlockDate = 100;

    await expectSaga(
      addNewStake,
      stakingActions.addNewStake({ unlockDate, stakeAmount })
    )
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .provide([
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(fishTokenSelector), mockFishToken],
        [
          matchers.select(fishTokenDataSelector),
          { allowanceForStaking: utils.parseEther('101') },
        ],

        [matchers.call.fn(mockStaking.stake), mockStakeTx],
        [matchers.call.fn(mockStakeTx.wait), mockStakeReceipt],
      ])
      .select(stakingContractSelector)
      .select(fishTokenSelector)
      .select(fishTokenDataSelector)
      .call(
        mockStaking.stake,
        utils.parseEther(stakeAmount),
        unlockDate + ONE_DAY,
        constants.AddressZero,
        constants.AddressZero
      )
      .hasFinalState(expectedState)
      .run();

    expect(mockFishToken.approve).not.toHaveBeenCalled();
  });

  it('call failure', async () => {
    const errorMsg = 'stake tx error';

    const expectedState: DeepPartial<RootState> = {
      ...stakingInitialState,
      [Reducers.Staking]: {
        ...stakingInitialState[Reducers.Staking],
        addNewStakeCall: {
          status: 'failure',
          currentOperation: 'stake',
          steps: [
            {
              ...stakingInitialState[Reducers.Staking]?.addNewStakeCall
                ?.steps?.[0],
              tx: mockApproveTx,
              txReceipt: mockApproveReceipt,
            },
            {
              ...stakingInitialState[Reducers.Staking]?.addNewStakeCall
                ?.steps?.[1],
              tx: mockStakeTx,
              error: errorMsg,
            },
          ],
        },
      },
    };

    const stakeAmount = '100';
    const unlockDate = 100;

    await expectSaga(
      addNewStake,
      stakingActions.addNewStake({ unlockDate, stakeAmount })
    )
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .provide([
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(fishTokenSelector), mockFishToken],
        [matchers.select(fishTokenDataSelector), { allowanceForStaking: '0' }],

        [matchers.call.fn(mockFishToken.approve), mockApproveTx],
        [matchers.call.fn(mockApproveTx.wait), mockApproveReceipt],

        [matchers.call.fn(mockStaking.stake), mockStakeTx],
        [matchers.call.fn(mockStakeTx.wait), throwError(new Error(errorMsg))],
      ])
      .select(stakingContractSelector)
      .select(fishTokenSelector)
      .select(fishTokenDataSelector)
      .call(
        mockFishToken.approve,
        mockStaking.address,
        utils.parseEther(stakeAmount)
      )
      .call(
        mockStaking.stake,
        utils.parseEther(stakeAmount),
        unlockDate + ONE_DAY,
        constants.AddressZero,
        constants.AddressZero
      )
      .put(stakingActions.setAddStakeError(errorMsg))
      .hasFinalState(expectedState)
      .run();
  });
});
