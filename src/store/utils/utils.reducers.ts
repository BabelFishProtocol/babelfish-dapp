import { CallState, StepData } from '../types';

export const handleUpdateCallStatus = <Operations extends string>(
  currentState: CallState<Operations>,
  payload: Partial<CallState<Operations>>
) => ({
  ...currentState,
  ...payload,
});

export const handleUpdateStepData = <Operations extends string>(
  currentState: CallState<Operations>,
  payload: Partial<StepData<Operations>>
) => {
  if (!currentState.currentOperation) {
    return currentState;
  }

  const stepIndex = currentState.steps.findIndex(
    (step) => step.name === currentState.currentOperation
  );

  currentState.steps[stepIndex] = {
    ...currentState.steps[stepIndex],
    ...payload,
  };

  return currentState;
};

export const handleSetCallError = <Operations extends string>(
  currentState: CallState<Operations>,
  payload: string
) => {
  const result = handleUpdateCallStatus(currentState, { status: 'failure' });
  return handleUpdateStepData(result, { error: payload });
};
