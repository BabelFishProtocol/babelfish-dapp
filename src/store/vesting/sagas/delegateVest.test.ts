import { ContractTransaction } from 'ethers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { TransactionReceipt } from '@ethersproject/providers';

import { VestingState } from '../vesting.state';
import { createMockVestingContract } from '../vesting.mock';
import { vestingActions, vestingReducer } from '../vesting.slice';
import { selectedVestContractSelector } from '../vesting.selectors';
import { delegateVest } from './delegateVest';

const mockVesting = createMockVestingContract('0x0');
const initialState = { ...new VestingState() };

afterEach(() => {
  jest.clearAllMocks();
});

describe('delegateVest', () => {
  const mockDelegateTx = {
    hash: '0x01',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockDelegateReceipt = {
    transactionHash: '0x01',
  } as TransactionReceipt;

  const initialSteps = initialState?.delegateCall?.steps;

  it('happy path', async () => {
    const expectedState: VestingState = {
      ...initialState,
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
    };

    const delegateTo = '0x0001';

    await expectSaga(delegateVest, vestingActions.delegateVest({ delegateTo }))
      .withReducer(vestingReducer)
      .withState(initialState)
      .provide([
        [matchers.select(selectedVestContractSelector), mockVesting],
        [matchers.call.fn(mockVesting.delegate), mockDelegateTx],
        [matchers.call.fn(mockDelegateTx.wait), mockDelegateReceipt],
      ])
      .select(selectedVestContractSelector)
      .call(mockVesting.delegate, delegateTo)
      .call(mockDelegateTx.wait)
      .hasFinalState(expectedState)
      .run();
  });

  it('call failure', async () => {
    const errorMsg = 'vest tx error';

    const expectedState: VestingState = {
      ...initialState,
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
    };

    const delegateTo = '0x01';

    await expectSaga(delegateVest, vestingActions.delegateVest({ delegateTo }))
      .withReducer(vestingReducer)
      .withState(initialState)
      .provide([
        [matchers.select(selectedVestContractSelector), mockVesting],
        [
          matchers.call.fn(mockVesting.delegate),
          throwError(new Error(errorMsg)),
        ],
      ])
      .select(selectedVestContractSelector)
      .call(mockVesting.delegate, delegateTo)
      .put(vestingActions.setDelegateError(errorMsg))
      .hasFinalState(expectedState)
      .run();
  });

  it('when vest is not selected', async () => {
    const expectedState: VestingState = {
      ...initialState,
      delegateCall: {
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
      delegateVest,
      vestingActions.delegateVest({ delegateTo: '0x001' })
    )
      .withReducer(vestingReducer)
      .withState(initialState)
      .provide([[matchers.select(selectedVestContractSelector), undefined]])
      .select(selectedVestContractSelector)
      .put(vestingActions.setDelegateError('Vesting not selected'))
      .hasFinalState(expectedState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
