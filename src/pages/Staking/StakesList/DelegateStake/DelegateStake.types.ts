import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import {
  DelegateValues,
  FeeEstimator,
  FeeEstimatorProps,
} from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';

export type DelegateStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type DelegateStakeComponentProps = DelegateStakeContainerProps &
  Pick<FeeEstimatorProps<DelegateValues>, 'estimateFee'> & {
    account: string;
    onDelegate: (formValues: DelegateValues) => Promise<void>;
    onCancelDelegation: () => Promise<void>;
    currentDelegate: string;
  };

export type DelegateFeeEstimator = FeeEstimator;
