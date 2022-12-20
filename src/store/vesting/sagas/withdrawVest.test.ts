import { ContractTransaction } from 'ethers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { TransactionReceipt } from '@ethersproject/providers';

import { VestingState } from '../vesting.state';
import { createMockVestingContract } from '../vesting.mock';
import { vestingActions, vestingReducer } from '../vesting.slice';
import { selectedVestContractSelector } from '../vesting.selectors';

import { withdrawVest } from './withdrawVest';

const mockVesting = createMockVestingContract(
  '0x0000000000000000000000000000000000000000'
);
const initialState = { ...new VestingState() };

afterEach(() => {
  jest.clearAllMocks();
});

describe('withdrawVest', () => {
  const mockWithdrawTx = {
    hash: '0x01',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockWithdrawReceipt = {
    transactionHash: '0x01',
  } as TransactionReceipt;

  const initialSteps = initialState?.withdrawCall?.steps;

  it('happy path', async () => {
    const expectedState: VestingState = {
      ...initialState,
      withdrawCall: {
        status: 'success',
        currentOperation: 'withdraw',
        steps: [
          {
            ...initialSteps?.[0],
            tx: mockWithdrawTx,
            txReceipt: mockWithdrawReceipt,
          },
        ],
      },
    };

    const withdrawTo = '0x0001';

    await expectSaga(withdrawVest, vestingActions.withdrawVest({ withdrawTo }))
      .withReducer(vestingReducer)
      .withState(initialState)
      .provide([
        [matchers.select(selectedVestContractSelector), mockVesting],
        [matchers.call.fn(mockVesting.withdrawTokens), mockWithdrawTx],
        [matchers.call.fn(mockWithdrawTx.wait), mockWithdrawReceipt],
      ])
      .select(selectedVestContractSelector)
      .call(mockVesting.withdrawTokens, withdrawTo)
      .call(mockWithdrawTx.wait)
      .hasFinalState(expectedState)
      .run();
  });

  it('call failure', async () => {
    const errorMsg = 'vest tx error';

    const expectedState: VestingState = {
      ...initialState,
      withdrawCall: {
        status: 'failure',
        currentOperation: 'withdraw',
        steps: [
          {
            ...initialSteps?.[0],
            error: errorMsg,
          },
        ],
      },
    };

    const withdrawTo = '0x01';

    await expectSaga(withdrawVest, vestingActions.withdrawVest({ withdrawTo }))
      .withReducer(vestingReducer)
      .withState(initialState)
      .provide([
        [matchers.select(selectedVestContractSelector), mockVesting],
        [
          matchers.call.fn(mockVesting.withdrawTokens),
          throwError(new Error(errorMsg)),
        ],
      ])
      .select(selectedVestContractSelector)
      .call(mockVesting.withdrawTokens, withdrawTo)
      .put(vestingActions.setWithdrawError(errorMsg))
      .hasFinalState(expectedState)
      .run();
  });

  it('when vest is not selected', async () => {
    const expectedState: VestingState = {
      ...initialState,
      withdrawCall: {
        status: 'failure',
        steps: [
          {
            ...initialSteps?.[0],
            error: 'Vesting not selected',
          },
        ],
      },
    };

    const runResult = await expectSaga(
      withdrawVest,
      vestingActions.withdrawVest({ withdrawTo: '0x001' })
    )
      .withReducer(vestingReducer)
      .withState(initialState)
      .provide([[matchers.select(selectedVestContractSelector), undefined]])
      .select(selectedVestContractSelector)
      .put(vestingActions.setWithdrawError('Vesting not selected'))
      .hasFinalState(expectedState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
