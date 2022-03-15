import { Control } from 'react-hook-form';
import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { DelegateFeeEstimator } from '../../Staking.types';
import { DelegateVestValues } from './DelegateVest.fields';

export type DelegateVestContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type DelegateVestComponentProps = DelegateVestContainerProps &
  Pick<FeeEstimatorProps, 'estimateFee'> & {
    votingPower: string;
    currentDelegate: string;
    onDelegate: (formValues: DelegateVestValues) => Promise<void>;
  };

export type FeeEstimatorProps = {
  estimateFee: DelegateFeeEstimator;
  control: Control<DelegateVestValues>;
};
