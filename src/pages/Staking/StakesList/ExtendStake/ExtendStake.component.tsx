import { useState } from 'react';

import Typography from '@mui/material/Typography';

import { formatTimestamp } from '../../../../utils/helpers';

import { Button } from '../../../../components/Button/Button.component';
import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { DateSelector } from '../../../../components/DateSelector/DateSelector.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';

import { ExtendStakeComponentProps } from './ExtendStake.types';

export const ExtendStakeComponent = ({
  open,
  txFee,
  stakes,
  onClose,
  prevDate,
  kickoffTs,
  votingPower,
  stakedAmount,
}: ExtendStakeComponentProps) => {
  const [unlockDate, setUnlockDate] = useState<number>();

  return (
    <DialogForm
      open={open}
      txFee={txFee}
      onClose={onClose}
      title="Extend Fish Stake"
      leftButton={<Button>Confirm</Button>}
      rightButton={
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <Typography>Previous Until: {formatTimestamp(prevDate)}</Typography>

      <CurrencyInput
        disabled
        symbol="FISH"
        value={stakedAmount}
        title="Staked Amount"
      />

      <DateSelector
        stakes={stakes}
        value={unlockDate}
        prevDate={prevDate}
        kickoffTs={kickoffTs}
        onChange={setUnlockDate}
      />

      <CurrencyInput
        disabled
        symbol=""
        value={votingPower}
        title="Voting Power Received"
      />
    </DialogForm>
  );
};
