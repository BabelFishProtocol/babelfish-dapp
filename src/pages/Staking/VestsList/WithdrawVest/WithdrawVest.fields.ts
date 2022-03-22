import { Fields } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';

export const WithdrawVestFields = Fields;

export type WithdrawVestFormValues = {
  [WithdrawVestFields.withdrawTo]: string;
};

export const withdrawVestDefaultValues = {
  [WithdrawVestFields.withdrawTo]: '',
};
