import Box from '@mui/material/Box';
import { useForm, useWatch } from 'react-hook-form';

import Typography from '@mui/material/Typography';

import { formatWeiAmount, isRskAddress } from '../../../../utils/helpers';
import { Button } from '../../../../components/Button/Button.component';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { ControlledAddressInput } from '../../../../components/AddressInput/AddressInput.controlled';

import { useEstimateDelegateFee } from '../../Staking.hooks';
import {
  DelegateStakeComponentProps,
  FeeEstimatorProps,
} from './DelegateStake.types';
import {
  delegateStakeDefaultValues,
  DelegateStakeFields,
  DelegateStakeValues,
} from './DelegateStake.fields';

export const DelegateStakeComponent = ({
  open,
  onClose,
  account,
  onDelegate,
  estimateFee,
  currentDelegate,
  onCancelDelegation,
}: DelegateStakeComponentProps) => {
  const { control, formState, handleSubmit } = useForm<DelegateStakeValues>({
    mode: 'onChange',
    defaultValues: delegateStakeDefaultValues,
  });

  const hasDelegate =
    isRskAddress(currentDelegate) && currentDelegate !== account;

  return (
    <DialogForm
      open={open}
      isValid={formState.isValid}
      onClose={onClose}
      title="Delegate"
      handleSubmit={handleSubmit(onDelegate)}
      leftButtonText="Confirm"
    >
      {hasDelegate && (
        <>
          <TextInput
            disabled
            value={currentDelegate}
            title="Current Delegation"
          />
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Button onClick={onCancelDelegation}>Cancel Delegation</Button>
          </Box>
        </>
      )}

      <ControlledAddressInput
        autoFocus
        name={DelegateStakeFields.delegateTo}
        control={control}
        title="Delegate To"
        placeholder="Enter or paste delegate address"
      />

      <FeeEstimator control={control} estimateFee={estimateFee} />
    </DialogForm>
  );
};

const FeeEstimator = ({ control, estimateFee }: FeeEstimatorProps) => {
  const watchDelegateTo = useWatch({
    control,
    name: DelegateStakeFields.delegateTo,
  });

  const estimatedFee = useEstimateDelegateFee({
    delegateTo: watchDelegateTo,
    estimator: estimateFee,
  });

  return (
    <Typography>Tx Fee: {formatWeiAmount(estimatedFee, 7)} RBTC</Typography>
  );
};
