import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import {
  DelegateValues,
  FeeEstimatorProps,
} from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';

export type DelegateVestContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type DelegateVestComponentProps = DelegateVestContainerProps &
  Pick<FeeEstimatorProps, 'estimateFee'> & {
    votingPower: string;
    currentDelegate: string;
    onDelegate: (formValues: DelegateValues) => Promise<void>;
  };
