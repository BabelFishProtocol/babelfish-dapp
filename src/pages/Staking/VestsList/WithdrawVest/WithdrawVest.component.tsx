import { useState } from 'react';

import { Button } from '../../../../components/Button/Button.component';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';

import { WithdrawVestComponentProps } from './WithdrawVest.types';

export const WithdrawVestComponent = ({
  open,
  txFee,
  onClose,
  delegate,
  unlockedAmount,
}: WithdrawVestComponentProps) => {
  const [recipient, setRecipient] = useState(delegate);

  const onRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };

  return (
    <DialogForm
      open={open}
      txFee={txFee}
      onClose={onClose}
      title="UnStake Fish"
      leftButton={<Button>Confirm</Button>}
    >
      <TextInput
        autoFocus
        title="Receive FISH At"
        value={recipient}
        onChange={onRecipientChange}
        placeholder="Enter or place address"
      />

      <CurrencyInput
        disabled
        symbol="FISH"
        value={unlockedAmount}
        title="Unlocked FISH"
      />
    </DialogForm>
  );
};
