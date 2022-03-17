export enum WithdrawVestFields {
  WithdrawTo = 'withdrawVestTo',
}

export type WithdrawVestFormValues = {
  [WithdrawVestFields.WithdrawTo]: string;
};

export const withdrawVestDefaultValues = {
  [WithdrawVestFields.WithdrawTo]: '',
};
