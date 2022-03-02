import { utils } from 'ethers';
import { useForm } from 'react-hook-form';

import Typography from '@mui/material/Typography';

import { formatWeiAmount } from '../../../../utils/helpers';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';
import { ControlledInputWithButtonPillGroup } from '../../../../components/InputPillGroup/InputWithButtonPillGroup.controlled';

import {
  WithdrawStakeComponentProps,
  WithdrawStakeFormValues,
} from './WithdrawStake.types';
import { WithdrawStakeFields } from './WithdrawStake.fields';

export const WithdrawStakeComponent = ({
  open,
  onClose,
  forfeitPercent,
  forfeitWithdraw,
  currentStakeAmount,
}: WithdrawStakeComponentProps) => {
  const { control, setValue } = useForm<WithdrawStakeFormValues>({
    defaultValues: {
      [WithdrawStakeFields.WithdrawStakeAmount]: '',
    },
  });
  return (
    <DialogForm
      open={open}
      isValid
      onClose={onClose}
      title="Unstake Fish"
      leftButtonText="Confirm"
    >
      <CurrencyInput
        disabled
        symbol="FISH"
        value={currentStakeAmount}
        title="Amount Currently Staked"
      />

      <ControlledInputWithButtonPillGroup
        autoFocus
        symbol="FISH"
        title="Amount To Unstake"
        totalAmount={utils.parseUnits('2.234')}
        name={WithdrawStakeFields.WithdrawStakeAmount}
        control={control}
        setValue={setValue}
      />

      <TextInput
        disabled
        value={`${forfeitPercent}% ≈  ${forfeitWithdraw} FISH`}
        title="Early Unstake Forfeit"
      />

      <FeeEstimator />
    </DialogForm>
  );
};

const FeeEstimator = () => (
  <Typography>Tx Fee: {formatWeiAmount('30000000000000', 7)} RBTC</Typography>
);
