import { useState } from 'react';
import { utils } from 'ethers';

import { Button } from '../../../components/Button/Button.component';
import { TextInput } from '../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../components/DialogForm/DialogForm.component';
import { DateSelector } from '../../../components/DateSelector/DateSelector.component';
import { InputWithButtonPillGroup } from '../../../components/InputPillGroup/InputWithButtonPillGroup.component';

import { AddNewStakeComponentProps } from './AddNewStake.types';

export const AddNewStakeComponent = ({
  open,
  txFee,
  onClose,
  stakes,
  votingPower,
  kickoffTs,
}: AddNewStakeComponentProps) => {
  const [unlockDate, setUnlockDate] = useState<number>();

  return (
    <DialogForm
      open={open}
      txFee={txFee}
      title="Stake Fish"
      onClose={onClose}
      leftButton={<Button>Stake</Button>}
    >
      <InputWithButtonPillGroup
        autoFocus
        symbol="FISH"
        title="Amount To Stake"
        totalAmount={utils.parseUnits('2.234')}
      />

      <DateSelector
        value={unlockDate}
        stakes={stakes}
        kickoffTs={kickoffTs}
        onChange={setUnlockDate}
      />

      <TextInput disabled value={votingPower} title="Voting Power received" />
    </DialogForm>
  );
};
