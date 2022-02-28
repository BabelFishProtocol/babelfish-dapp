import { useState } from 'react';

import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import { formatWeiAmount, isRskAddress } from '../../../../utils/helpers';
import { Button } from '../../../../components/Button/Button.component';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';

import { DelegateStakeComponentProps } from './DelegateStake.types';

export const DelegateStakeComponent = ({
  open,
  onClose,
  account,
  currentDelegate,
}: DelegateStakeComponentProps) => {
  const [delegate, setDelegate] = useState('');

  const onDelegateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelegate(e.target.value);
  };

  const hasDelegate =
    isRskAddress(currentDelegate) && currentDelegate !== account;

  return (
    <DialogForm
      open={open}
      isValid
      onClose={onClose}
      title="Delegate"
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
            <Button>Cancel Delegation</Button>
          </Box>
        </>
      )}

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
