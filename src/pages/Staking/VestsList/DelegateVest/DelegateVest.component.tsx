import { useState } from 'react';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import { formatWeiAmount } from '../../../../utils/helpers';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';

import { DelegateVestComponentProps } from './DelegateVest.types';

export const DelegateVestComponent = ({
  open,
  onClose,
  votingPower,
  currentDelegate,
}: DelegateVestComponentProps) => {
  const [delegate, setDelegate] = useState('');

  const onDelegateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelegate(e.target.value);
  };

  return (
    <DialogForm
      open={open}
      isValid
      onClose={onClose}
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
          {votingPower}
        </Typography>
      </Box>
      <TextInput disabled value={currentDelegate} title="Delegate From" />

      <TextInput
        autoFocus
        value={delegate}
        title="Delegate To"
        onChange={onDelegateChange}
        placeholder="Enter or paste delegate address"
      />

      <FeeEstimator />
    </DialogForm>
  );
};

const FeeEstimator = () => (
  <Typography>Tx Fee: {formatWeiAmount('30000000000000', 7)} RBTC</Typography>
);
