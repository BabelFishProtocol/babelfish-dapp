import { BigNumber, utils } from 'ethers';
import { useForm, useWatch } from 'react-hook-form';

import Typography from '@mui/material/Typography';

import { formatTimestamp, formatWeiAmount } from '../../../../utils/helpers';

import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';
import { ControlledDateSelector } from '../../../../components/DateSelector/DateSelector.controlled';

import { useEstimateFee, useVotingPower } from '../../Staking.hooks';
import {
  ExtendStakeComponentProps,
  FeeEstimatorProps,
  VotingPowerBlockProps,
} from './ExtendStake.types';
import {
  extendStakeDefaultValues,
  ExtendStakeFields,
  ExtendStakeValues,
} from './ExtendStake.fields';

export const ExtendStakeComponent = ({
  open,
  stakes,
  onClose,
  onExtend,
  prevDate,
  kickoffTs,
  stakedAmount,
  estimateExtendFee,
}: ExtendStakeComponentProps) => {
  const { control, formState, handleSubmit } = useForm<ExtendStakeValues>({
    mode: 'onChange',
    defaultValues: extendStakeDefaultValues,
  });

  return (
    <DialogForm
      open={open}
      isValid={formState.isValid}
      onClose={onClose}
      title="Extend Fish Stake"
      leftButtonText="Confirm"
      handleSubmit={handleSubmit(onExtend)}
    >
      <Typography>Previous Until: {formatTimestamp(prevDate)}</Typography>

      <CurrencyInput
        disabled
        symbol="FISH"
        value={formatWeiAmount(stakedAmount)}
        title="Staked Amount"
      />

      <ControlledDateSelector
        control={control}
        name={ExtendStakeFields.unlockDate}
        stakes={stakes}
        prevDate={prevDate}
        kickoffTs={kickoffTs}
      />

      <VotingPower
        control={control}
        prevDate={prevDate}
        stakedAmount={stakedAmount}
      />

      <FeeEstimator
        control={control}
        stakedAmount={stakedAmount}
        estimateExtendFee={estimateExtendFee}
      />
    </DialogForm>
  );
};

const VotingPower = ({
  control,
  prevDate,
  stakedAmount,
}: VotingPowerBlockProps) => {
  const watchUnlockDate = useWatch({
    name: ExtendStakeFields.unlockDate,
    control,
  });

  const prevVotingPower = useVotingPower(
    utils.formatEther(stakedAmount),
    prevDate
  );

  const currVotingPower = useVotingPower(
    utils.formatEther(stakedAmount),
    watchUnlockDate
  );

  const votingPower = BigNumber.from(currVotingPower).gt(prevVotingPower)
    ? BigNumber.from(currVotingPower).sub(prevVotingPower)
    : '0';

  return (
    <TextInput
      disabled
      value={formatWeiAmount(votingPower)}
      title="Voting Power Received"
    />
  );
};

const FeeEstimator = ({
  control,
  stakedAmount,
  estimateExtendFee,
}: FeeEstimatorProps) => {
  const watchUnlockDate = useWatch({
    name: ExtendStakeFields.unlockDate,
    control,
  });

  const estimatedFee = useEstimateFee({
    amount: stakedAmount,
    timestamp: watchUnlockDate,
    estimator: estimateExtendFee,
  });

  return (
    <Typography>Tx Fee: {formatWeiAmount(estimatedFee, 7)} RBTC</Typography>
  );
};
