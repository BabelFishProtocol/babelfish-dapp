import { DateSelectorProps } from '../../../../components/DateSelector/DateSelector.types';
import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';

export type ExtendStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type ExtendStakeComponentProps = ExtendStakeContainerProps &
  Pick<DateSelectorProps, 'kickoffTs' | 'stakes'> & {
    txFee: string;
    prevDate: number;
    votingPower: string;
    stakedAmount: string;
  };
