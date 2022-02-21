import { utils } from 'ethers';

import { Button } from '../../../../components/Button/Button.component';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';
import { InputWithButtonPillGroup } from '../../../../components/InputPillGroup/InputWithButtonPillGroup.component';

import { WithdrawStakeComponentProps } from './WithdrawStake.types';

export const WithdrawStakeComponent = ({
  open,
  txFee,
  onClose,
  forfeitPercent,
  forfeitWithdraw,
  currentStakeAmount,
}: WithdrawStakeComponentProps) => (
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

    <InputWithButtonPillGroup
      autoFocus
      symbol="FISH"
      title="Amount To Unstake"
      totalAmount={utils.parseUnits('2.234')}
    />

    <TextInput
      disabled
      value={`${forfeitPercent}% ≈  ${forfeitWithdraw} FISH`}
      title="Early Unstake Forfeit"
    />
  </DialogForm>
);
