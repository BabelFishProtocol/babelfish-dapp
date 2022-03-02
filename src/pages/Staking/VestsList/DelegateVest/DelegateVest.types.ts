import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';

export type DelegateVestContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type DelegateVestComponentProps = DelegateVestContainerProps & {
  votingPower: string;
  currentDelegate: string;
};
