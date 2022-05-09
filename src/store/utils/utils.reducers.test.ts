import { TransactionReceipt } from '@ethersproject/providers';
import {
  handleSetCallError,
  handleUpdateStepData,
  handleUpdateCallStatus,
  handleUpdateSteps,
} from './utils.reducers';
import { initialCallState, populatedCallState } from './utils.mock';

describe('reducers utils', () => {
  describe('handleUpdateSteps', () => {
    it('filters steps correctly', () => {
      const result = handleUpdateSteps(initialCallState, [{ name: 'step1' }]);

      expect(result).toEqual({
        ...initialCallState,
        steps: [initialCallState.steps[0]],
      });
    });
  });

  describe('handleUpdateCallStatus', () => {
    it('returns properly updated state', () => {
      const result = handleUpdateCallStatus(initialCallState, {
        status: 'loading',
        currentOperation: 'step2',
      });

      expect(result).toEqual({
        ...initialCallState,
        status: 'loading',
        currentOperation: 'step2',
      });
    });
  });

  describe('handleUpdateStepData', () => {
    it('properly updates current step', () => {
      const step1TxReceipt = { transactionHash: '0x01' } as TransactionReceipt;

      const updatedStep1 = handleUpdateStepData(populatedCallState, {
        txReceipt: step1TxReceipt,
      });

      expect(updatedStep1).toEqual({
        ...populatedCallState,
        steps: [
          {
            ...populatedCallState.steps[0],
            txReceipt: step1TxReceipt,
          },
          populatedCallState.steps[1],
        ],
      });

      // ----- update current step and check if following changes will be applied it correctly -----

      const step2TxReceipt = { transactionHash: '0x02' } as TransactionReceipt;

      const newState = handleUpdateCallStatus(initialCallState, {
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

    it('updates first step when current step it is not settled', () => {
      const result = handleUpdateStepData(initialCallState, {
        error: 'test test',
      });

      expect(result).toEqual({
        ...initialCallState,
        steps: [
          {
            ...initialCallState.steps[0],
            error: 'test test',
          },
          initialCallState.steps[1],
        ],
      });
    });
  });

  describe('handleSetCallError', () => {
    it('updates state properly', () => {
      const errorMsg = 'test error';
      const result = handleSetCallError(populatedCallState, errorMsg);

      expect(result).toEqual({
        ...populatedCallState,
        steps: [
          {
            ...populatedCallState.steps[0],
            error: errorMsg,
          },
          populatedCallState.steps[1],
        ],
        status: 'failure',
      });
    });

    it('works fine when current step is not settled', () => {
      const errorMsg = 'test error';
      const result = handleSetCallError(initialCallState, errorMsg);

      expect(result).toEqual({
        ...initialCallState,
        status: 'failure',
        steps: [
          {
            ...initialCallState.steps[0],
            error: errorMsg,
          },
          initialCallState.steps[1],
        ],
      });
    });
  });
});
