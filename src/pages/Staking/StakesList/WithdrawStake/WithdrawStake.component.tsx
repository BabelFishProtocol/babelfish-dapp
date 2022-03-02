import { useState } from 'react';
import { BigNumber } from 'ethers';
import { useSelector } from 'react-redux';
import { useForm, useWatch } from 'react-hook-form';

import Typography from '@mui/material/Typography';

import { formatTimestamp, formatWeiAmount } from '../../../../utils/helpers';
import { selectedStakeSelector } from '../../../../store/staking/staking.selectors';

import {
  DialogForm,
  DialogButtonsAligner,
} from '../../../../components/DialogForm/DialogForm.component';
import { Button } from '../../../../components/Button/Button.component';
import { AppDialog } from '../../../../components/AppDialog/AppDialog.component';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';
import { ControlledInputWithButtonPillGroup } from '../../../../components/InputPillGroup/InputWithButtonPillGroup.controlled';

import { useEstimateFee } from '../../Staking.hooks';
import {
  FeeEstimatorProps,
  WithdrawStakeComponentProps,
  WithdrawStakeConfirmationDialogProps,
} from './WithdrawStake.types';
import {
  withdrawStakeDefaultValues,
  WithdrawStakeFields,
  WithdrawStakeFormValues,
} from './WithdrawStake.fields';

export const WithdrawStakeComponent = ({
  open,
  onClose,
  isLocked,
  onWithdraw,
  forfeitPercent,
  forfeitWithdraw,
  currentStakeAmount,
  calculateFeeAndForfeit,
}: WithdrawStakeComponentProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedFormValues, setSubmittedFormValues] =
    useState<WithdrawStakeFormValues>();

  const { control, setValue, handleSubmit, formState } =
    useForm<WithdrawStakeFormValues>({
      mode: 'onChange',
      defaultValues: withdrawStakeDefaultValues,
    });

  const handleOpenConfirmation = (values: WithdrawStakeFormValues) => {
    setSubmittedFormValues(values);
    setShowConfirmation(true);
  };
  const handleCloseConfirmation = () => setShowConfirmation(false);

  const onConfirm = () => {
    handleCloseConfirmation();
    onWithdraw(submittedFormValues as WithdrawStakeFormValues);
  };

  return (
    <DialogForm
      open={open}
      onClose={onClose}
      title="Unstake Fish"
      leftButtonText="Confirm"
      isValid={formState.isValid}
      handleSubmit={handleSubmit(
        isLocked ? onWithdraw : handleOpenConfirmation
      )}
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
        title="Amount To Unstake"
        totalAmount={BigNumber.from(currentStakeAmount)}
        name={WithdrawStakeFields.WithdrawAmount}
        control={control}
        setValue={setValue}
      />

      {!isLocked && (
        <TextInput
          disabled
          value={`${forfeitPercent}% ≈  ${formatWeiAmount(
            forfeitWithdraw
          )} FISH`}
          title="Early Unstake Forfeit"
        />
      )}

      <FeeEstimator
        control={control}
        calculateFeeAndForfeit={calculateFeeAndForfeit}
      />

      {showConfirmation && (
        <WithdrawStakeConfirmationDialog
          isOpenDialog={showConfirmation}
          onSubmit={onConfirm}
          onClose={handleCloseConfirmation}
          forfeitWithdraw={forfeitWithdraw}
        />
      )}
    </DialogForm>
  );
};

const FeeEstimator = ({
  control,
  calculateFeeAndForfeit,
}: FeeEstimatorProps) => {
  const selectedStakeData = useSelector(selectedStakeSelector);
  const watchWithdrawAmount = useWatch({
    name: WithdrawStakeFields.WithdrawAmount,
    control,
  });

  const estimatedFee = useEstimateFee({
    amount: watchWithdrawAmount,
    timestamp: selectedStakeData?.unlockDate,
    estimator: calculateFeeAndForfeit,
  });

  return (
    <Typography>Tx Fee: {formatWeiAmount(estimatedFee, 7)} RBTC</Typography>
  );
};

export const WithdrawStakeConfirmationDialog = ({
  onClose,
  onSubmit,
  isOpenDialog,
  forfeitWithdraw,
}: WithdrawStakeConfirmationDialogProps) => {
  const selectedStakeData = useSelector(selectedStakeSelector);

  return (
    <AppDialog
      onClose={onClose}
      isOpenDialog={isOpenDialog}
      title="Are You shure You want to unstake?"
      description={
        <>
          <Typography>This stake is not scheduled to unlock until:</Typography>
          <Typography variant="h6" color="error">
            {formatTimestamp(selectedStakeData?.unlockDate)}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            Unstaking now invokes a slashing penalty that will cost you:
          </Typography>
          <Typography variant="h6" color="error">
            {formatWeiAmount(forfeitWithdraw)} FISH
          </Typography>
        </>
      }
    >
      <DialogButtonsAligner>
        <Button onClick={onSubmit}>Unstake</Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogButtonsAligner>
    </AppDialog>
  );
};
