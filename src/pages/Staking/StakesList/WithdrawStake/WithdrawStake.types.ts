import { Control } from 'react-hook-form';
import { AppDialogProps } from '../../../../components/AppDialog/AppDialog.types';
import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { StakingFeeEstimator } from '../../Staking.types';
import { WithdrawStakeFormValues } from './WithdrawStake.fields';

export type WithdrawStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type WithdrawStakeComponentProps = WithdrawStakeContainerProps & {
  forfeitPercent: string;
  forfeitWithdraw: string;
  currentStakeAmount: string;
  onWithdraw: (values: WithdrawStakeFormValues) => void;
  calculateFeeAndForfeit: StakingFeeEstimator;
};

export type FeeEstimatorProps = Pick<
  WithdrawStakeComponentProps,
  'calculateFeeAndForfeit'
> & {
  control: Control<WithdrawStakeFormValues>;
};

export type WithdrawStakeConfirmationDialogProps = Pick<
  AppDialogProps,
  'isOpenDialog' | 'onClose'
> &
  Pick<WithdrawStakeComponentProps, 'forfeitWithdraw'> & {
    onSubmit: () => void;
  };
