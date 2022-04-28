import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import { useForm, useWatch } from 'react-hook-form';

import Typography from '@mui/material/Typography';

import { formatWeiAmount } from '../../../../utils/helpers';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';
import { ControlledInputWithButtonPillGroup } from '../../../../components/InputPillGroup/InputWithButtonPillGroup.controlled';

import { StakingFeeEstimator } from '../../Staking.types';
import {
  FeeEstimatorProps,
  IncreaseStakeComponentProps,
  IncreaseStakeFormValues,
  VotingPowerBlockProps,
} from './IncreaseStake.types';
import {
  increaseStakeDefaultValues,
  IncreaseStakeFields,
} from './IncreaseStake.fields';
import {
  useEstimateFee,
  useNeedApproval,
  useVotingPower,
} from '../../Staking.hooks';

export const IncreaseStakeComponent = ({
  open,
  onClose,
  unlockDate,
  handleIncrease,
  currentStakeAmount,
  estimateStakeFee,
  estimateApproveFee,
  fishBalance = '0',
}: IncreaseStakeComponentProps) => {
  const { control, setValue, formState, watch, handleSubmit } =
    useForm<IncreaseStakeFormValues>({
      mode: 'onChange',
      defaultValues: increaseStakeDefaultValues,
    });

  const needsApproval = useNeedApproval(
    watch,
    IncreaseStakeFields.IncreaseStakeAmount
  );

  const feeEstimator: StakingFeeEstimator = useCallback(
    async (amount, timestamp) => {
      const stakeFee = await estimateStakeFee(amount, timestamp);

      if (!needsApproval) return stakeFee;

      const approveFee =
        (await estimateApproveFee(amount, timestamp)) ?? BigNumber.from(0);

      return approveFee.add(stakeFee ?? BigNumber.from(0));
    },
    [needsApproval, estimateApproveFee, estimateStakeFee]
  );

  return (
    <DialogForm
      open={open}
      isValid={formState.isValid}
      onClose={onClose}
      title="Add To Stake"
      leftButtonText="Stake"
      handleSubmit={handleSubmit(handleIncrease)}
    >
      <CurrencyInput
        disabled
        symbol="FISH"
        value={formatWeiAmount(currentStakeAmount)}
        title="Amount Currently Staked"
      />

      <ControlledInputWithButtonPillGroup
        autoFocus
        symbol="FISH"
        title="Amount To Add"
        totalAmount={fishBalance}
        name={IncreaseStakeFields.IncreaseStakeAmount}
        control={control}
        setValue={setValue}
      />

      <VotingPower control={control} unlockDate={unlockDate} />

      <FeeEstimator
        control={control}
        unlockDate={unlockDate}
        feeEstimator={feeEstimator}
      />
    </DialogForm>
  );
};

const VotingPower = ({ control, unlockDate }: VotingPowerBlockProps) => {
  const watchStakeAmount = useWatch({
    name: IncreaseStakeFields.IncreaseStakeAmount,
    control,
  });

  const votingPower = useVotingPower(watchStakeAmount, unlockDate);

  return (
    <TextInput
      disabled
      value={formatWeiAmount(votingPower)}
      title="New Voting Power"
    />
  );
};

const FeeEstimator = ({
  control,
  unlockDate,
  feeEstimator,
}: FeeEstimatorProps) => {
  const watchStakeAmount = useWatch({
    name: IncreaseStakeFields.IncreaseStakeAmount,
    control,
  });

  const estimatedFee = useEstimateFee({
    amount: watchStakeAmount,
    timestamp: unlockDate,
    estimator: feeEstimator,
  });

  return (
    <Typography>Tx Fee: {formatWeiAmount(estimatedFee, 7)} RBTC</Typography>
  );
};
