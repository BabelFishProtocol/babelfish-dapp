import { ClaimFormValues, ClaimInputs } from './Claim.fields';

export type ClaimFields = {
  [ClaimInputs.ClaimAmount]: string;
};

export type ClaimComponentProps = {
  onSubmit: (data: ClaimFormValues) => void;
};
