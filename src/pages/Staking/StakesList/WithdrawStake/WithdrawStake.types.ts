import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';

export type WithdrawStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type WithdrawStakeComponentProps = WithdrawStakeContainerProps & {
  txFee: string;
  forfeitPercent: string;
  forfeitWithdraw: string;
  currentStakeAmount: string;
};
