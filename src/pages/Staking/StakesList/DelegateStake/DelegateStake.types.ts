import { Control } from 'react-hook-form';
import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { DelegateFeeEstimator } from '../../Staking.types';
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

export type FeeEstimatorProps = {
  estimateFee: DelegateFeeEstimator;
  control: Control<DelegateStakeValues>;
};
