import { useState } from 'react';
import { utils } from 'ethers';

import { useForm } from 'react-hook-form';
import { Button } from '../../../components/Button/Button.component';
import { TextInput } from '../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../components/DialogForm/DialogForm.component';
import { ControlledInputWithButtonPillGroup } from '../../../components/InputPillGroup/InputWithButtonPillGroup.controlled';

import {
  AddNewStakeComponentProps,
  AddNewStakeFormValues,
} from './AddNewStake.types';
import { AddNewStakeFields } from './AddNewStake.fields';

export const AddNewStakeComponent = ({
  open,
  txFee,
  onClose,
  stakes,
  votingPower,
  kickoffTs,
}: AddNewStakeComponentProps) => {
  const [unlockDate, setUnlockDate] = useState<number>();

  // TODO: change dateSelector and slectDate to controlled inputs by react-hook-form
  const { control, setValue } = useForm<AddNewStakeFormValues>({
    defaultValues: {
      [AddNewStakeFields.stakeAmount]: '',
    },
  });

  return (
    <DialogForm
      open={open}
      txFee={txFee}
      title="Stake Fish"
      onClose={onClose}
      leftButton={<Button>Stake</Button>}
    >
      <ControlledInputWithButtonPillGroup
        autoFocus
        symbol="FISH"
        title="Amount To Stake"
        totalAmount={utils.parseUnits('2.234')}
        name={AddNewStakeFields.stakeAmount}
        control={control}
        setValue={setValue}
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
