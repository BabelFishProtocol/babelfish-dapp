import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';

export type WithdrawVestContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type WithdrawVestComponentProps = WithdrawVestContainerProps & {
  delegate: string;
  unlockedAmount: string;
};
