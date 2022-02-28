import { Control } from 'react-hook-form';
import { DateSelectorProps } from '../../../components/DateSelector/DateSelector.types';
import { DialogFormProps } from '../../../components/DialogForm/DialogForm.types';
import { StakingFeeEstimator } from '../Staking.types';
import { AddNewStakeFields } from './AddNewStake.fields';

export type AddNewStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

type FormSubmittor = (formValues: AddNewStakeFormValues) => Promise<void>;

export type FeeEstimatorProps = Record<
  'estimateStakeFee' | 'esmimateApproveFee',
  StakingFeeEstimator
> & {
  needsApproval: boolean;
  control: Control<AddNewStakeFormValues>;
};

export type VotingPowerBlockProps = {
  control: Control<AddNewStakeFormValues>;
};

export type AddNewStakeComponentProps = AddNewStakeContainerProps &
  Pick<FeeEstimatorProps, 'esmimateApproveFee' | 'estimateStakeFee'> &
  Record<'onStake' | 'onApprove', FormSubmittor> &
  Pick<DateSelectorProps, 'kickoffTs' | 'stakes'> & {
    fishBalance?: string;
  };

export type AddNewStakeFormValues = {
  [AddNewStakeFields.stakeAmount]: string;
  [AddNewStakeFields.unlockDate]: number;
};
