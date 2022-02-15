import { useState } from 'react';

import { Button } from '../../../../components/Button/Button.component';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';

import { DelegateStakeComponentProps } from './DelegateStake.types';

export const DelegateStakeComponent = ({
  open,
  txFee,
  onClose,
}: DelegateStakeComponentProps) => {
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
