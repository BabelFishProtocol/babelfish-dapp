import { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit';
import { CallState, SagaContractCallStep, StepData } from '../types';

export type StepCallsActions<Operations extends string> = {
  setStatus: PayloadAction<
    Partial<Pick<CallState<Operations>, 'status' | 'currentOperation'>>
  >;
  setSteps: PayloadAction<{ name: Operations }[]>;
  updateStep: PayloadAction<Partial<StepData<Operations>>>;
  setError: PayloadAction<string>;
};

export type ContractStepCallSagaParams<Operations extends string> = {
  steps: SagaContractCallStep<Operations>[];
  setErrorAction: ActionCreatorWithPayload<
    StepCallsActions<Operations>['setError']['payload']
  >;
  setStatusAction: ActionCreatorWithPayload<
    StepCallsActions<Operations>['setStatus']['payload']
  >;
  setStepDataAction: ActionCreatorWithPayload<
    StepCallsActions<Operations>['updateStep']['payload']
  >;
};
