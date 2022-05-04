import { DefaultValues } from 'react-hook-form';

export enum ClaimInputs {
  ClaimAmount = 'ClaimAmount',
}

export type ClaimFormValues = {
  [ClaimInputs.ClaimAmount]: string;
};

export const ClaimDefaultValues: DefaultValues<ClaimFormValues> = {
  [ClaimInputs.ClaimAmount]: '',
};
