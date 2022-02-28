import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { WithdrawStakeFields } from './WithdrawStake.fields';

export type WithdrawStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type WithdrawStakeComponentProps = WithdrawStakeContainerProps & {
  forfeitPercent: string;
  forfeitWithdraw: string;
  currentStakeAmount: string;
};

export type WithdrawStakeFormValues = {
  [WithdrawStakeFields.WithdrawStakeAmount]: string;
};
