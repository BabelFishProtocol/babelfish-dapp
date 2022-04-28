import { PayloadAction } from '@reduxjs/toolkit';
import { CallState, StepData } from '../types';

export type StepCallsActions<Operations extends string> = {
  setStatus: PayloadAction<
    Pick<CallState<Operations>, 'status' | 'currentOperation'>
  >;
  setSteps: PayloadAction<{ name: Operations }[]>;
  updateStep: PayloadAction<Partial<StepData<Operations>>>;
  setError: PayloadAction<string>;
};
