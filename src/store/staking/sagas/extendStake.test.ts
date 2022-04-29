import { ContractTransaction } from 'ethers';
import { DeepPartial } from '@reduxjs/toolkit';
import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { TransactionReceipt } from '@ethersproject/providers';

import { RootState } from '../..';
import { Reducers } from '../../../constants';

import { stakingContractSelector } from '../../app/app.selectors';
import {
  mockStaking,
  stakingReducer,
  stakingInitialState,
} from '../staking.mock';
import { stakingActions } from '../staking.slice';
import { selectedStakeSelector } from '../staking.selectors';

import { extendStake } from './extendStake';

afterEach(() => {
  jest.clearAllMocks();
});

describe('extendStake', () => {
  const mockExtendTx = {
    hash: '0x01',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockExtendReceipt = {
    transactionHash: '0x01',
  } as TransactionReceipt;

  const initialSteps = stakingInitialState[Reducers.Staking]?.extendCall?.steps;

  it('happy path', async () => {
    const expectedState: DeepPartial<RootState> = {
      ...stakingInitialState,
      [Reducers.Staking]: {
        ...stakingInitialState[Reducers.Staking],
        extendCall: {
          status: 'success',
          currentOperation: 'extend',
          steps: [
            {
              ...initialSteps?.[0],
              tx: mockExtendTx,
              txReceipt: mockExtendReceipt,
            },
          ],
        },
      },
    };

    const prevUnlockDate = 50;
    const unlockDate = 100;

    await expectSaga(extendStake, stakingActions.extendStake({ unlockDate }))
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .provide([
        [matchers.select(stakingContractSelector), mockStaking],
        [
          matchers.select(selectedStakeSelector),
          { unlockDate: prevUnlockDate },
        ],
        [matchers.call.fn(mockStaking.extendStakingDuration), mockExtendTx],
        [matchers.call.fn(mockExtendTx.wait), mockExtendReceipt],
      ])
      .select(stakingContractSelector)
      .select(selectedStakeSelector)
      .call(mockStaking.extendStakingDuration, prevUnlockDate, unlockDate)
      .hasFinalState(expectedState)
      .run();
  });

  it('call failure', async () => {
    const errorMsg = 'stake tx error';

    const expectedState: DeepPartial<RootState> = {
      ...stakingInitialState,
      [Reducers.Staking]: {
        ...stakingInitialState[Reducers.Staking],
        extendCall: {
          status: 'failure',
          currentOperation: 'extend',
          steps: [
            {
              ...initialSteps?.[0],
              error: errorMsg,
            },
          ],
        },
      },
    };

    const prevUnlockDate = 50;
    const unlockDate = 100;

    await expectSaga(extendStake, stakingActions.extendStake({ unlockDate }))
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .provide([
        [matchers.select(stakingContractSelector), mockStaking],
        [
          matchers.select(selectedStakeSelector),
          { unlockDate: prevUnlockDate },
        ],
        [
          matchers.call.fn(mockStaking.extendStakingDuration),
          throwError(new Error(errorMsg)),
        ],
        [matchers.call.fn(mockExtendTx.wait), mockExtendReceipt],
      ])
      .call(mockStaking.extendStakingDuration, prevUnlockDate, unlockDate)
      .hasFinalState(expectedState)
      .run();
  });

  it('when stake is not selected', async () => {
    const expectedState: DeepPartial<RootState> = {
      ...stakingInitialState,
      [Reducers.Staking]: {
        ...stakingInitialState[Reducers.Staking],
        extendCall: {
          status: 'failure',
          steps: [
            {
              ...initialSteps?.[0],
              error: 'No stake selected',
            },
          ],
        },
      },
    };

    const unlockDate = 100;

    const runResult = await expectSaga(
      extendStake,
      stakingActions.extendStake({ unlockDate })
    )
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .provide([
        [matchers.select(selectedStakeSelector), undefined],
        [matchers.select(stakingContractSelector), mockStaking],
      ])
      .select(selectedStakeSelector)
      .select(stakingContractSelector)
      .put(stakingActions.setExtendError('No stake selected'))
      .hasFinalState(expectedState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
