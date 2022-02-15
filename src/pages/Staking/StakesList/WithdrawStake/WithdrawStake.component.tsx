import { utils } from 'ethers';

import { Button } from '../../../../components/Button/Button.component';
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
    rightButton={
      <Button variant="outlined" onClick={onClose}>
        Cancel
      </Button>
    }
  >
    <CurrencyInput
      disabled
      symbol="FISH"
      value={currentStakeAmount}
      title="Amount Currently Staked"
    />

    <InputWithButtonPillGroup
      symbol="FISH"
      title="Amount To Unstake"
      totalAmount={utils.parseUnits('2.234')}
    />

    <CurrencyInput
      disabled
      symbol=""
      value={`${forfeitPercent}% ≈  ${forfeitWithdraw} FISH`}
      title="Early Unstake Forfeit"
    />
  </DialogForm>
);
