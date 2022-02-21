import { useState } from 'react';

import Box from '@mui/material/Box';

import { isRskAddress } from '../../../../utils/helpers';
import { Button } from '../../../../components/Button/Button.component';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';

import { DelegateStakeComponentProps } from './DelegateStake.types';

export const DelegateStakeComponent = ({
  open,
  txFee,
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
      txFee={txFee}
      onClose={onClose}
      title="Delegate"
      leftButton={<Button>Confirm</Button>}
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
    </DialogForm>
  );
};
