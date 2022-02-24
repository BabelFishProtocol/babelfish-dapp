import { utils } from 'ethers';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/Button/Button.component';
import { TextInput } from '../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../components/DialogForm/DialogForm.component';
import { ControlledDateSelector } from '../../../components/ControlledDateSelector/ControlledDateSelector.component';
import { ControlledInputWithButtonPillGroup } from '../../../components/ControlledInputWithButtonPillGroup/ControlledInputWithButtonPillGroup.component';

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
  onSubmit,
  votingPower,
  kickoffTs,
}: AddNewStakeComponentProps) => {
  const { control, setValue, handleSubmit } = useForm<AddNewStakeFormValues>({
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
      handleSubmit={handleSubmit(onSubmit)}
      leftButton={<Button type="submit">Stake</Button>} // change to buttonText. Add loading, disabled states inside DialogForm
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

      <ControlledDateSelector
        name={AddNewStakeFields.unlockDate}
        stakes={stakes}
        kickoffTs={kickoffTs}
        control={control}
      />

      <TextInput disabled value={votingPower} title="Voting Power received" />
    </DialogForm>
  );
};
