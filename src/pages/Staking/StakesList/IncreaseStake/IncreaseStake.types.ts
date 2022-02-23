import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { IncreaseStakeFields } from './IncreaseStake.fields';

export type IncreaseStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type IncreaseStakeComponentProps = IncreaseStakeContainerProps & {
  txFee: string;
  votingPower: string;
  currentStakeAmount: string;
};

export type IncreaseStakeFormValues = {
  [IncreaseStakeFields.IncreaseStakeAmount]: string;
};
