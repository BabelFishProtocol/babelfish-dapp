import { ContractTransaction } from 'ethers';
import { TransactionReceipt } from '@ethersproject/providers';
import { CallState } from '../types';
import {
  handleSetCallError,
  handleUpdateStepData,
  handleUpdateCallStatus,
} from './utils.reducers';

describe('reducers utils', () => {
  const initialState: CallState<'step1' | 'step2'> = {
    status: 'idle',
    steps: [{ name: 'step1' }, { name: 'step2' }],
  };

  const populatedState: CallState<'step1' | 'step2'> = {
    status: 'success',
    currentOperation: 'step1',
    steps: [
      { name: 'step1', tx: { hash: '0x01' } as ContractTransaction },
      { name: 'step2', tx: { hash: '0x02' } as ContractTransaction },
    ],
  };

  describe('handleUpdateCallStatus', () => {
    it('returns properly updated state', () => {
      const result = handleUpdateCallStatus(initialState, {
        status: 'loading',
        currentOperation: 'step2',
      });

      expect(result).toEqual({
        ...initialState,
        status: 'loading',
        currentOperation: 'step2',
      });
    });
  });

  describe('handleUpdateStepData', () => {
    it('properly updates current step', () => {
      const step1TxReceipt = { transactionHash: '0x01' } as TransactionReceipt;

      const updatedStep1 = handleUpdateStepData(populatedState, {
        txReceipt: step1TxReceipt,
      });

      expect(updatedStep1).toEqual({
        ...populatedState,
        steps: [
          {
            ...populatedState.steps[0],
            txReceipt: step1TxReceipt,
          },
          populatedState.steps[1],
        ],
      });

      // ----- update current step and check if following changes will be applied it correctly -----

      const step2TxReceipt = { transactionHash: '0x02' } as TransactionReceipt;

      const newState = handleUpdateCallStatus(initialState, {
        currentOperation: 'step2',
      });

      const updatedStep2 = handleUpdateStepData(newState, {
        txReceipt: step2TxReceipt,
      });

      expect(updatedStep2).toEqual({
        ...newState,
        steps: [
          newState.steps[0],
          {
            ...newState.steps[1],
            txReceipt: step2TxReceipt,
          },
        ],
      });
    });

    it('does nothing when current step is not settled', () => {
      const result = handleUpdateStepData(initialState, { error: 'test test' });

      expect(result).toEqual(initialState);
    });
  });

  describe('handleSetCallError', () => {
    it('updates state properly', () => {
      const errorMsg = 'test error';
      const result = handleSetCallError(populatedState, errorMsg);

      expect(result).toEqual({
        ...populatedState,
        steps: [
          {
            ...populatedState.steps[0],
            error: errorMsg,
          },
          populatedState.steps[1],
        ],
        status: 'failure',
      });
    });

    it('works fine when current step is not settled', () => {
      const errorMsg = 'test error';
      const result = handleSetCallError(initialState, errorMsg);

      expect(result).toEqual({
        ...initialState,
        status: 'failure',
      });
    });
  });
});
