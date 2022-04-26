import { Control } from 'react-hook-form';
import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { StakingFeeEstimator } from '../../Staking.types';
import { IncreaseStakeFields } from './IncreaseStake.fields';

export type IncreaseStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type IncreaseStakeComponentProps = IncreaseStakeContainerProps &
  Record<'estimateStakeFee' | 'estimateApproveFee', StakingFeeEstimator> & {
    handleIncrease: (formValues: IncreaseStakeFormValues) => void;
    unlockDate: number;
    fishBalance?: string;
    currentStakeAmount: string;
  };

export type VotingPowerBlockProps = {
  control: Control<IncreaseStakeFormValues>;
  unlockDate: number;
};

export type FeeEstimatorProps = {
  feeEstimator: StakingFeeEstimator;
  control: Control<IncreaseStakeFormValues>;
  unlockDate: number;
};

export type IncreaseStakeFormValues = {
  [IncreaseStakeFields.IncreaseStakeAmount]: string;
};
