import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import { useForm, useWatch } from 'react-hook-form';

import Typography from '@mui/material/Typography';

import { formatWeiAmount } from '../../../utils/helpers';
import { TextInput } from '../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../components/DialogForm/DialogForm.component';
import { ControlledDateSelector } from '../../../components/DateSelector/DateSelector.controlled';
import { ControlledInputWithButtonPillGroup } from '../../../components/InputPillGroup/InputWithButtonPillGroup.controlled';

import { StakingFeeEstimator } from '../Staking.types';
import {
  AddNewStakeFormValues,
  AddNewStakeComponentProps,
  FeeEstimatorProps,
  VotingPowerBlockProps,
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

export const AddNewStakeComponent = ({
  open,
  onClose,
  stakes,
  onStake,
  kickoffTs,
  estimateStakeFee,
  estimateApproveFee,
  fishBalance = '0',
}: AddNewStakeComponentProps) => {
  const { control, setValue, handleSubmit, formState, watch } =
    useForm<AddNewStakeFormValues>({
      mode: 'onChange',
      defaultValues: addNewStakeDefaultValues,
    });

  const needsApproval = useNeedApproval(watch, AddNewStakeFields.stakeAmount);

  const feeEstimator: StakingFeeEstimator = useCallback(
    async (amount, timestamp) => {
      const stakeFee = await estimateStakeFee(amount, timestamp);

      console.log(stakeFee, stakeFee ? stakeFee.toString() : 'dupa');

      if (!needsApproval) return stakeFee;

      const approveFee =
        (await estimateApproveFee(amount, timestamp)) ?? BigNumber.from(0);

      console.log(
        approveFee,
        approveFee.toString(),
        approveFee.add(stakeFee ?? BigNumber.from(0)).toString()
      );

      return approveFee.add(stakeFee ?? BigNumber.from(0));
    },
    [needsApproval, estimateApproveFee, estimateStakeFee]
  );

  return (
    <DialogForm
      open={open}
      title="Stake Fish"
      onClose={onClose}
      isValid={formState.isValid}
      leftButtonText="Stake"
      handleSubmit={handleSubmit(onStake)}
    >
      <ControlledInputWithButtonPillGroup
        autoFocus
        symbol="FISH"
        title="Amount To Stake"
        name={AddNewStakeFields.stakeAmount}
        totalAmount={fishBalance}
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

      <FeeEstimator control={control} feeEstimator={feeEstimator} />
    </DialogForm>
  );
};

const VotingPower = ({ control }: VotingPowerBlockProps) => {
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

const FeeEstimator = ({ control, feeEstimator }: FeeEstimatorProps) => {
  const watchStakeAmount = useWatch({
    name: AddNewStakeFields.stakeAmount,
    control,
  });
  const watchUnlockDate = useWatch({
    name: AddNewStakeFields.unlockDate,
    control,
  });

  const estimatedFee = useEstimateFee({
    amount: watchStakeAmount,
    timestamp: watchUnlockDate,
    estimator: feeEstimator,
  });

  return (
    <Typography>Tx Fee: {formatWeiAmount(estimatedFee, 7)} RBTC</Typography>
  );
};
