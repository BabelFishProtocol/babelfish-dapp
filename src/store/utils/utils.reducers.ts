import { PayloadAction } from '@reduxjs/toolkit';
import { CallState, StepData } from '../types';
import { StepCallsActions } from './utils.types';

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

/**
 * @description         Function that creates set of actions to control the state of step forms
 * @param initialState  Initial state of the slice. Needed to reset values in some cases
 * @param key           Field in the state in which the call data is stored
 * @returns             Set of actions that are ready to be connected to a slice
 */
export const createStepCallsActions = <
  State extends Record<Key, CallState<string>>,
  Key extends keyof State
>(
  initialState: State,
  key: Key
) => {
  type Operations = State[Key] extends CallState<infer O> ? O : string;

  type Actions = StepCallsActions<Operations>;
  type BaseState = Record<Key, CallState<Operations>>;

  return {
    trigger:
      <Payload>() =>
      (state: State, _: PayloadAction<Payload>) => {
        state[key] = initialState[key];
      },
    reset: (state: State) => {
      state[key] = initialState[key];
    },
    setStatus: (state: BaseState, { payload }: Actions['setStatus']) => {
      state[key] = handleUpdateCallStatus(state[key], payload);
    },
    setSteps: (state: BaseState, { payload }: Actions['setSteps']) => {
      state[key] = handleUpdateSteps(state[key], payload);
    },
    updateStep: (state: BaseState, { payload }: Actions['updateStep']) => {
      state[key] = handleUpdateStepData(state[key], payload);
    },
    setStepError: (state: BaseState, { payload }: Actions['setError']) => {
      state[key] = handleSetCallError(state[key], payload);
    },
  };
};
