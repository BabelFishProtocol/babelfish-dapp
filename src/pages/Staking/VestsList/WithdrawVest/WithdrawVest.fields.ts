export enum WithdrawVestFields {
  withdrawTo = 'withdrawTo',
}

export type WithdrawVestFormValues = {
  [WithdrawVestFields.withdrawTo]: string;
};

export const withdrawVestDefaultValues = {
  [WithdrawVestFields.withdrawTo]: '',
};
