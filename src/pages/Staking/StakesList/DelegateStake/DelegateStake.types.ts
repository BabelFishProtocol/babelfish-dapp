import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';

export type DelegateStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type DelegateStakeComponentProps = DelegateStakeContainerProps & {
  txFee: string;
  account: string;
  currentDelegate: string;
};