import { useState } from 'react';

import Typography from '@mui/material/Typography';

import { formatWeiAmount } from '../../../../utils/helpers';
import { TextInput } from '../../../../components/TextInput/TextInput.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';

import { WithdrawVestComponentProps } from './WithdrawVest.types';

export const WithdrawVestComponent = ({
  open,
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
      isValid
      onClose={onClose}
      title="UnStake Fish"
      leftButtonText="Confirm"
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

      <FeeEstimator />
    </DialogForm>
  );
};

const FeeEstimator = () => (
  <Typography>Tx Fee: {formatWeiAmount('30000000000000', 7)} RBTC</Typography>
);
