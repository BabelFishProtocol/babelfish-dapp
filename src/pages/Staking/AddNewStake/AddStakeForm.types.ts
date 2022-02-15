import { DateSelectorProps } from '../../../components/DateSelector/DateSelector.types';
import { DialogFormProps } from '../../../components/DialogForm/DialogForm.types';

export type AddNewStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type AddNewStakeComponentProps = AddNewStakeContainerProps &
  Pick<DateSelectorProps, 'kickoffTs' | 'stakes'> & {
    txFee: string;
    votingPower: string;
  };
