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
import { delegateStake } from './delegateStake';

afterEach(() => {
  jest.clearAllMocks();
});

describe('delegateStake', () => {
  const mockDelegateTx = {
    hash: '0x01',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockDelegateReceipt = {
    transactionHash: '0x01',
  } as TransactionReceipt;

  const initialSteps =
    stakingInitialState[Reducers.Staking]?.delegateCall?.steps;

  it('happy path', async () => {
    const expectedState: DeepPartial<RootState> = {
      ...stakingInitialState,
      [Reducers.Staking]: {
        ...stakingInitialState[Reducers.Staking],
        delegateCall: {
          status: 'success',
          currentOperation: 'delegate',
          steps: [
            {
              ...initialSteps?.[0],
              tx: mockDelegateTx,
              txReceipt: mockDelegateReceipt,
            },
          ],
        },
      },
    };

    const delegateTo = '0x0001';
    const unlockDate = 100;

    await expectSaga(
      delegateStake,
      stakingActions.delegateStake({ delegateTo })
    )
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .provide([
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(selectedStakeSelector), { unlockDate }],
        [matchers.call.fn(mockStaking.delegate), mockDelegateTx],
        [matchers.call.fn(mockDelegateTx.wait), mockDelegateReceipt],
      ])
      .select(stakingContractSelector)
      .select(selectedStakeSelector)
      .call(mockStaking.delegate, delegateTo, unlockDate)
      .hasFinalState(expectedState)
      .run();
  });

  it('call failure', async () => {
    const errorMsg = 'stake tx error';

    const expectedState: DeepPartial<RootState> = {
      ...stakingInitialState,
      [Reducers.Staking]: {
        ...stakingInitialState[Reducers.Staking],
        delegateCall: {
          status: 'failure',
          currentOperation: 'delegate',
          steps: [
            {
              ...initialSteps?.[0],
              error: errorMsg,
            },
          ],
        },
      },
    };

    const unlockDate = 100;
    const delegateTo = '0x01';

    await expectSaga(
      delegateStake,
      stakingActions.delegateStake({ delegateTo })
    )
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .provide([
        [matchers.select(stakingContractSelector), mockStaking],
        [matchers.select(selectedStakeSelector), { unlockDate }],
        [
          matchers.call.fn(mockStaking.delegate),
          throwError(new Error(errorMsg)),
        ],
      ])
      .call(mockStaking.delegate, delegateTo, unlockDate)
      .hasFinalState(expectedState)
      .run();
  });

  it('when stake is not selected', async () => {
    const expectedState: DeepPartial<RootState> = {
      ...stakingInitialState,
      [Reducers.Staking]: {
        ...stakingInitialState[Reducers.Staking],
        delegateCall: {
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

    const delegateTo = '0x001';

    const runResult = await expectSaga(
      delegateStake,
      stakingActions.delegateStake({ delegateTo })
    )
      .withReducer(stakingReducer)
      .withState(stakingInitialState)
      .provide([
        [matchers.select(selectedStakeSelector), undefined],
        [matchers.select(stakingContractSelector), mockStaking],
      ])
      .select(selectedStakeSelector)
      .select(stakingContractSelector)
      .put(stakingActions.setDelegateError('No stake selected'))
      .hasFinalState(expectedState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
