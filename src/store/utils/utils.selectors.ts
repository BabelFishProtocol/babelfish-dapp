import { CallState } from '../types';

export const selectCurrentCallStepData = <Operations extends string>(
  state: CallState<Operations>
) => {
  const currentStep = state.steps.find(
    (step) => step.name === state.currentOperation
  );

  return {
    status: state.status,
    currentStep: state.currentOperation,
    currentTx: currentStep?.tx,
    currentTxReceipt: currentStep?.txReceipt,
  };
};
