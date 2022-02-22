import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';

export type WithdrawVestContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type WithdrawVestComponentProps = WithdrawVestContainerProps & {
  txFee: string;
  delegate: string;
  unlockedAmount: string;
};
