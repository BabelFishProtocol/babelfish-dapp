import { utils } from 'ethers';

import { useForm } from 'react-hook-form';
import { Button } from '../../../../components/Button/Button.component';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';

import {
  IncreaseStakeComponentProps,
  IncreaseStakeFormValues,
} from './IncreaseStake.types';
import { ControlledInputWithButtonPillGroup } from '../../../../components/ControlledInputWithButtonPillGroup/ControlledInputWithButtonPillGroup.component';
import { IncreaseStakeFields } from './IncreaseStake.fields';

export const IncreaseStakeComponent = ({
  open,
  txFee,
  onClose,
  votingPower,
  currentStakeAmount,
}: IncreaseStakeComponentProps) => {
  // TODO: change dateSelector and slectDate to controlled inputs by react-hook-form
  const { control, setValue } = useForm<IncreaseStakeFormValues>({
    defaultValues: {
      [IncreaseStakeFields.IncreaseStakeAmount]: '',
    },
  });
  return (
    <DialogForm
      open={open}
      txFee={txFee}
      onClose={onClose}
      title="Add To Stake"
      leftButton={<Button>Stake</Button>}
    >
      <CurrencyInput
        disabled
        symbol="FISH"
        value={currentStakeAmount}
        title="Amount Currently Staked"
      />

      <ControlledInputWithButtonPillGroup
        symbol="FISH"
        title="Amount To Add"
        totalAmount={utils.parseUnits('2.234')}
        name={IncreaseStakeFields.IncreaseStakeAmount}
        control={control}
        setValue={setValue}
      />

      <TextInput disabled value={votingPower} title="New Voting Power" />
    </DialogForm>
  );
};
