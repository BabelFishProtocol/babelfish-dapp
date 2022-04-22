import { StepData } from '../types';
import { initialCallState, populatedCallState } from './utils.mock';
import { selectCurrentCallStepData } from './utils.selectors';

describe('selectors utils', () => {
  describe('selectCurrentCallStepData', () => {
    it('selects data of current step', () => {
      const result = selectCurrentCallStepData({
        ...populatedCallState,
        currentOperation: 'step1',
      });

      const expectedCurrentStep = populatedCallState.steps[0] as Required<
        StepData<'step1' | 'step2'>
      >;

      expect(result.status).toBe(populatedCallState.status);
      expect(result.currentStep).toEqual(expectedCurrentStep);
      expect(result.steps).toEqual(populatedCallState.steps);
      expect(result.summary).toMatchInlineSnapshot(`
        Array [
          Object {
            "formatTx": true,
            "label": "step1 tx hash",
            "value": "0x01",
          },
          Object {
            "formatTx": true,
            "label": "step2 tx hash",
            "value": "0x02",
          },
          Object {
            "label": "Total Gas Used",
            "value": "0.0000006 RBTC",
          },
        ]
      `);

      const step2Result = selectCurrentCallStepData({
        ...populatedCallState,
        currentOperation: 'step2',
      });

      expect(step2Result.currentStep).toEqual(populatedCallState.steps[1]);
    });

    it('returns empty values when step is not selected', () => {
      const result = selectCurrentCallStepData(initialCallState);

      expect(result.currentStep).toBeUndefined();
      expect(result.status).toBe(initialCallState.status);
      expect(result.summary).toMatchInlineSnapshot(`
        Array [
          Object {
            "formatTx": true,
            "label": "step1 tx hash",
            "value": "",
          },
          Object {
            "formatTx": true,
            "label": "step2 tx hash",
            "value": "",
          },
          Object {
            "label": "Total Gas Used",
            "value": "0.0000000 RBTC",
          },
        ]
      `);
    });
  });
});
