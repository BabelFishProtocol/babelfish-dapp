import { useForm } from 'react-hook-form';
import { formatWeiAmount } from '../../../../utils/helpers';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';

import { WithdrawVestComponentProps } from './WithdrawVest.types';
import {
  withdrawVestDefaultValues,
  WithdrawVestFields,
  WithdrawVestFormValues,
} from './WithdrawVest.fields';
import { FeeEstimatorWithdraw } from '../../DelegateFeeEstimator/DelegateFeeEstimator.component';
import { ControlledAddressInput } from '../../../../components/AddressInput/AddressInput.controlled';

export const WithdrawVestComponent = ({
  open,
  onClose,
  onWithdraw,
  isLocked,
  currentVestAmount,
  estimateFee,
}: WithdrawVestComponentProps) => {
  const { control, handleSubmit, formState } = useForm<WithdrawVestFormValues>({
    mode: 'onChange',
    defaultValues: withdrawVestDefaultValues,
  });

  return (
    <DialogForm
      open={open}
      onClose={onClose}
      title="UnStake Fish"
      leftButtonText="Confirm"
      isValid={formState.isValid || !isLocked}
      handleSubmit={handleSubmit(onWithdraw)}
    >
      <CurrencyInput
        disabled
        symbol="FISH"
        value={formatWeiAmount(currentVestAmount)}
        title="Unlocked FISH"
      />
      <ControlledAddressInput
        autoFocus
        title="Address To Unstake"
        name={WithdrawVestFields.WithdrawTo}
        control={control}
        placeholder="Enter or paste withdraw address"
      />
      <FeeEstimatorWithdraw control={control} estimateFee={estimateFee} />
    </DialogForm>
  );
};
