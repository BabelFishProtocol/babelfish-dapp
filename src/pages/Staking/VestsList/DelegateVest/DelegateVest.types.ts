import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { FeeEstimatorProps } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';
import { DelegateVestValues } from './DelegateVest.fields';

export type DelegateVestContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type DelegateVestComponentProps = DelegateVestContainerProps &
  Pick<FeeEstimatorProps<DelegateVestValues>, 'estimateFee'> & {
    votingPower: string;
    currentDelegate: string;
    onDelegate: (formValues: DelegateVestValues) => Promise<void>;
  };
