import { BigNumber } from 'ethers';
import { Control, useForm, useWatch } from 'react-hook-form';

import { TextInput } from '../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../components/DialogForm/DialogForm.component';
import { ControlledDateSelector } from '../../../components/DateSelector/DateSelector.controlled';
import { ControlledInputWithButtonPillGroup } from '../../../components/InputPillGroup/InputWithButtonPillGroup.controlled';

import {
  AddNewStakeFormValues,
  AddNewStakeComponentProps,
} from './AddNewStake.types';
import {
  AddNewStakeFields,
  addNewStakeDefaultValues,
} from './AddNewStake.fields';
import {
  useEstimateFee,
  useNeedApproval,
  useVotingPower,
} from '../Staking.hooks';
import { formatWeiAmount } from '../../../utils/helpers';

export const AddNewStakeComponent = ({
  open,
  onClose,
  stakes,
  onStake,
  onApprove,
  kickoffTs,
  estimateStakeFee,
  esmimateApproveFee,
  fishBalance = '0',
}: AddNewStakeComponentProps) => {
  const { control, setValue, handleSubmit, formState, watch } =
    useForm<AddNewStakeFormValues>({
      mode: 'onChange',
      defaultValues: addNewStakeDefaultValues,
    });

  const needsApproval = useNeedApproval(watch, AddNewStakeFields.stakeAmount);
  const watchUnlockDate = watch(AddNewStakeFields.unlockDate);
  const estimatedFee = useEstimateFee({
    watch,
    amountField: 'stakeAmount',
    timestamp: watchUnlockDate,
    estimator: needsApproval ? esmimateApproveFee : estimateStakeFee,
  });

  return (
    <DialogForm
      open={open}
      txFee={estimatedFee}
      title="Stake Fish"
      onClose={onClose}
      isValid={formState.isValid}
      handleSubmit={handleSubmit(needsApproval ? onApprove : onStake)}
      leftButtonText={needsApproval ? 'Approve' : 'Stake'}
    >
      <ControlledInputWithButtonPillGroup
        autoFocus
        symbol="FISH"
        title="Amount To Stake"
        name={AddNewStakeFields.stakeAmount}
        totalAmount={BigNumber.from(fishBalance)}
        control={control}
        setValue={setValue}
      />

      <ControlledDateSelector
        name={AddNewStakeFields.unlockDate}
        stakes={stakes}
        kickoffTs={kickoffTs}
        control={control}
      />
      <VotingPower control={control} />
    </DialogForm>
  );
};

const VotingPower = ({
  control,
}: {
  control: Control<AddNewStakeFormValues>;
}) => {
  const watchStakeAmount = useWatch({
    name: AddNewStakeFields.stakeAmount,
    control,
  });
  const watchUnlockDate = useWatch({
    name: AddNewStakeFields.unlockDate,
    control,
  });

  const votingPower = useVotingPower(watchStakeAmount, watchUnlockDate);

  return (
    <TextInput
      disabled
      value={formatWeiAmount(votingPower)}
      title="Voting Power received"
    />
  );
};
