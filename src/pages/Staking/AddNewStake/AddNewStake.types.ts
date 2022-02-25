import { DateSelectorProps } from '../../../components/DateSelector/DateSelector.types';
import { DialogFormProps } from '../../../components/DialogForm/DialogForm.types';
import { StakingFeeEstimator } from '../Staking.hooks';
import { AddNewStakeFields } from './AddNewStake.fields';

export type AddNewStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

type FormSubmittor = (formValues: AddNewStakeFormValues) => Promise<void>;

export type AddNewStakeComponentProps = AddNewStakeContainerProps &
  Record<'estimateStakeFee' | 'esmimateApproveFee', StakingFeeEstimator> &
  Record<'onStake' | 'onApprove', FormSubmittor> &
  Pick<DateSelectorProps, 'kickoffTs' | 'stakes'> & {
    fishBalance?: string;
  };

export type AddNewStakeFormValues = {
  [AddNewStakeFields.stakeAmount]: string;
  [AddNewStakeFields.unlockDate]: number;
};
