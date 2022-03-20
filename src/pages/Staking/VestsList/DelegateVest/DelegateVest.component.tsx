import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import { useForm } from 'react-hook-form';
import { formatWeiAmount } from '../../../../utils/helpers';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';

import { DelegateVestComponentProps } from './DelegateVest.types';
import {
  delegateVestDefaultValues,
  DelegateVestFields,
  DelegateVestValues,
} from './DelegateVest.fields';
import { ControlledAddressInput } from '../../../../components/AddressInput/AddressInput.controlled';
import { FeeEstimator } from '../../DelegateFeeEstimator/DelegateFeeEstimator.component';

export const DelegateVestComponent = ({
  open,
  onClose,
  votingPower,
  currentDelegate,
  onDelegate,
  estimateFee,
}: DelegateVestComponentProps) => {
  const { control, formState, handleSubmit } = useForm<DelegateVestValues>({
    mode: 'onChange',
    defaultValues: delegateVestDefaultValues,
  });

  return (
    <DialogForm
      open={open}
      isValid={formState.isValid}
      onClose={onClose}
      handleSubmit={handleSubmit(onDelegate)}
      title="Delegate"
      leftButtonText="Confirm"
    >
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Typography variant="h6" sx={{}}>
          Voting Power:
        </Typography>
        <Typography variant="h6" sx={{}} color="primary">
          {formatWeiAmount(votingPower)}
        </Typography>
      </Box>
      <TextInput disabled value={currentDelegate} title="Delegate From" />
      <ControlledAddressInput
        autoFocus
        name={DelegateVestFields.delegateTo}
        control={control}
        title="Delegate To"
        placeholder="Enter or paste delegate address"
      />
      <FeeEstimator control={control} estimateFee={estimateFee} />
    </DialogForm>
  );
};
