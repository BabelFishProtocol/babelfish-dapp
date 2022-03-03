export enum WithdrawStakeFields {
  WithdrawAmount = 'withdrawStakeAmount',
}

export type WithdrawStakeFormValues = {
  [WithdrawStakeFields.WithdrawAmount]: string;
};

export const withdrawStakeDefaultValues = {
  [WithdrawStakeFields.WithdrawAmount]: '',
};
