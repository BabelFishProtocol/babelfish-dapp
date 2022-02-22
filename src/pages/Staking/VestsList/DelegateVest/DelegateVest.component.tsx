import { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Button } from '../../../../components/Button/Button.component';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';

import { DelegateVestComponentProps } from './DelegateVest.types';

export const DelegateVestComponent = ({
  open,
  txFee,
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
      txFee={txFee}
      onClose={onClose}
      title="Delegate"
      leftButton={<Button>Confirm</Button>}
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
    </DialogForm>
  );
};
