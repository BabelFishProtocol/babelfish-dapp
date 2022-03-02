import { utils } from 'ethers';
import { useForm } from 'react-hook-form';

import Typography from '@mui/material/Typography';

import { formatWeiAmount } from '../../../../utils/helpers';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';
import { ControlledInputWithButtonPillGroup } from '../../../../components/InputPillGroup/InputWithButtonPillGroup.controlled';

import {
  IncreaseStakeComponentProps,
  IncreaseStakeFormValues,
} from './IncreaseStake.types';
import { IncreaseStakeFields } from './IncreaseStake.fields';

export const IncreaseStakeComponent = ({
  open,
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
      isValid
      onClose={onClose}
      title="Add To Stake"
      leftButtonText="Stake"
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
        title="Amount To Add"
        totalAmount={utils.parseUnits('2.234')}
        name={IncreaseStakeFields.IncreaseStakeAmount}
        control={control}
        setValue={setValue}
      />

      <TextInput disabled value={votingPower} title="New Voting Power" />

      <FeeEstimator />
    </DialogForm>
  );
};

const FeeEstimator = () => (
  <Typography>Tx Fee: {formatWeiAmount('30000000000000', 7)} RBTC</Typography>
);
