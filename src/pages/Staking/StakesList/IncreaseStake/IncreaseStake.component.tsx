import { utils } from 'ethers';

import { Button } from '../../../../components/Button/Button.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';
import { InputWithButtonPillGroup } from '../../../../components/InputPillGroup/InputWithButtonPillGroup.component';

import { IncreaseStakeComponentProps } from './IncreaseStake.types';

export const IncreaseStakeComponent = ({
  open,
  txFee,
  onClose,
  votingPower,
  currentStakeAmount,
}: IncreaseStakeComponentProps) => (
  <DialogForm
    open={open}
    txFee={txFee}
    onClose={onClose}
    title="Add To Stake"
    leftButton={<Button>Stake</Button>}
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
      title="Amount To Add"
      totalAmount={utils.parseUnits('2.234')}
    />

    <CurrencyInput
      disabled
      symbol=""
      value={votingPower}
      title="New Voting Power"
    />
  </DialogForm>
);
