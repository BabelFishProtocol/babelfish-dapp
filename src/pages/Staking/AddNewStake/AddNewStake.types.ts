import { DateSelectorProps } from '../../../components/DateSelector/DateSelector.types';
import { DialogFormProps } from '../../../components/DialogForm/DialogForm.types';
import { AddNewStakeFields } from './AddNewStake.fields';

export type AddNewStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type AddNewStakeComponentProps = AddNewStakeContainerProps &
  Pick<DateSelectorProps, 'kickoffTs' | 'stakes'> & {
    txFee: string;
    votingPower: string;
    totalFishAmount: string;
    onSubmit: (formValues: AddNewStakeFormValues) => Promise<void>;
  };

export type AddNewStakeFormValues = {
  [AddNewStakeFields.stakeAmount]: string;
  [AddNewStakeFields.unlockDate]: number;
};
