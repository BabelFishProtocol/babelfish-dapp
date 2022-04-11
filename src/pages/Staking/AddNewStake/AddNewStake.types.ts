import { Control } from 'react-hook-form';
import { DateSelectorProps } from '../../../components/DateSelector/DateSelector.types';
import { DialogFormProps } from '../../../components/DialogForm/DialogForm.types';
import { StakingFeeEstimator } from '../Staking.types';
import { AddNewStakeFields } from './AddNewStake.fields';

export type AddNewStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type FeeEstimatorProps = Record<
  'estimateStakeFee' | 'estimateApproveFee',
  StakingFeeEstimator
> & {
  needsApproval: boolean;
  control: Control<AddNewStakeFormValues>;
};

export type VotingPowerBlockProps = {
  control: Control<AddNewStakeFormValues>;
};

export type AddNewStakeComponentProps = AddNewStakeContainerProps &
  Pick<FeeEstimatorProps, 'estimateApproveFee' | 'estimateStakeFee'> &
  Pick<DateSelectorProps, 'kickoffTs' | 'stakes'> & {
    onStake: (values: AddNewStakeFormValues) => void;
    fishBalance?: string;
  };

export type AddNewStakeFormValues = {
  [AddNewStakeFields.stakeAmount]: string;
  [AddNewStakeFields.unlockDate]: number;
};
