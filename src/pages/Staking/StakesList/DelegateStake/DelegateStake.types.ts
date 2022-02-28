import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';

export type DelegateStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type DelegateStakeComponentProps = DelegateStakeContainerProps & {
  account: string;
  currentDelegate: string;
};
