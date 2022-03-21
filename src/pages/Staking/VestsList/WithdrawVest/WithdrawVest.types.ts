import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { FeeEstimatorProps } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';
import { WithdrawVestFormValues } from './WithdrawVest.fields';

export type WithdrawVestContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type WithdrawVestComponentProps = WithdrawVestContainerProps &
  Pick<FeeEstimatorProps<WithdrawVestFormValues>, 'estimateFee'> & {
    isLocked: boolean;
    currentVestAmount: string;
    onWithdraw: (values: WithdrawVestFormValues) => void;
  };
