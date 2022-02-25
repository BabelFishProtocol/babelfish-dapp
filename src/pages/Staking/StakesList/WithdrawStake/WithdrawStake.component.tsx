import { utils } from 'ethers';

import { useForm } from 'react-hook-form';
import { Button } from '../../../../components/Button/Button.component';
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
  txFee,
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
      txFee={txFee}
      onClose={onClose}
      title="Unstake Fish"
      leftButton={<Button>Confirm</Button>}
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
    </DialogForm>
  );
};
