import { CallState, StepData } from '../types';

export const handleUpdateCallStatus = <Operations extends string>(
  currentState: CallState<Operations>,
  payload: Partial<CallState<Operations>>
) => ({
  ...currentState,
  ...payload,
});

export const handleUpdateSteps = <Operations extends string>(
  currentState: CallState<Operations>,
  payload: { name: Operations }[]
) => {
  const updatedSteps = currentState.steps.filter((step) =>
    payload.some(({ name }) => name === step.name)
  );

  return {
    ...currentState,
    steps: updatedSteps,
  };
};

export const handleUpdateStepData = <Operations extends string>(
  currentState: CallState<Operations>,
  payload: Partial<StepData<Operations>>
) => {
  const currentOperation =
    currentState.currentOperation ?? currentState.steps[0].name;

  const stepIndex = currentState.steps.findIndex(
    (step) => step.name === currentOperation
  );

  const updatedSteps = currentState.steps.map((step, index) => {
    if (stepIndex === index) {
      return {
        ...step,
        ...payload,
      };
    }

    return step;
  });

  return {
    ...currentState,
    steps: updatedSteps,
  };
};

export const handleSetCallError = <Operations extends string>(
  currentState: CallState<Operations>,
  payload: string
) => {
  const result = handleUpdateCallStatus(currentState, { status: 'failure' });
  return handleUpdateStepData(result, { error: payload });
};
