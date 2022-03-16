import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { FeeEstimatorProps } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';
import { DelegateStakeValues } from './DelegateStake.fields';

export type DelegateStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type DelegateStakeComponentProps = DelegateStakeContainerProps &
  Pick<FeeEstimatorProps, 'estimateFee'> & {
    account: string;
    onDelegate: (formValues: DelegateStakeValues) => Promise<void>;
    onCancelDelegation: () => Promise<void>;
    currentDelegate: string;
  };
