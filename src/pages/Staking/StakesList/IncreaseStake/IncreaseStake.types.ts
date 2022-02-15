import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';

export type IncreaseStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type IncreaseStakeComponentProps = IncreaseStakeContainerProps & {
  txFee: string;
  votingPower: string;
  currentStakeAmount: string;
};
