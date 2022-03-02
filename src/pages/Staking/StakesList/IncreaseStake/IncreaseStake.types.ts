import { Control } from 'react-hook-form';
import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { StakingFeeEstimator } from '../../Staking.types';
import { IncreaseStakeFields } from './IncreaseStake.fields';

export type IncreaseStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

type FormSubmittor = (formValues: IncreaseStakeFormValues) => Promise<void>;

export type IncreaseStakeComponentProps = IncreaseStakeContainerProps &
  Record<'onStake' | 'onApprove', FormSubmittor> &
  Pick<FeeEstimatorProps, 'estimateApproveFee' | 'estimateStakeFee'> & {
    unlockDate: number;
    fishBalance?: string;
    currentStakeAmount: string;
  };

export type VotingPowerBlockProps = {
  control: Control<IncreaseStakeFormValues>;
  unlockDate: number;
};

export type FeeEstimatorProps = Record<
  'estimateStakeFee' | 'estimateApproveFee',
  StakingFeeEstimator
> & {
  needsApproval: boolean;
  control: Control<IncreaseStakeFormValues>;
  unlockDate: number;
};

export type IncreaseStakeFormValues = {
  [IncreaseStakeFields.IncreaseStakeAmount]: string;
};
