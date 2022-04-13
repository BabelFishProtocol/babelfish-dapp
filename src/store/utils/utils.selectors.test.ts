import { initialCallState, populatedCallState } from './utils.mock';
import { selectCurrentCallStepData } from './utils.selectors';

describe('selectors utils', () => {
  describe('selectCurrentCallStepData', () => {
    it('selects data of current step', () => {
      const result = selectCurrentCallStepData({
        ...populatedCallState,
        currentOperation: 'step1',
      });

      expect(result).toEqual({
        status: populatedCallState.status,
        currentStep: populatedCallState.currentOperation,
        currentTx: populatedCallState.steps[0].tx,
        currentTxReceipt: populatedCallState.steps[0].txReceipt,
      });

      const step2Result = selectCurrentCallStepData({
        ...populatedCallState,
        currentOperation: 'step2',
      });

      expect(step2Result.currentTx).toEqual(populatedCallState.steps[1].tx);
      expect(step2Result.currentTxReceipt).toEqual(
        populatedCallState.steps[1].txReceipt
      );
    });

    it('returns empty values when step is not selected', () => {
      const result = selectCurrentCallStepData(initialCallState);

      expect(result).toEqual({
        status: initialCallState.status,
        currentStep: undefined,
        currentTx: undefined,
        currentTxReceipt: undefined,
      });
    });
  });
});
