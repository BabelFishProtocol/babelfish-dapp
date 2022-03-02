import { useState } from 'react';

import Typography from '@mui/material/Typography';

import { formatTimestamp, formatWeiAmount } from '../../../../utils/helpers';

import { DialogForm } from '../../../../components/DialogForm/DialogForm.component';
import { DateSelector } from '../../../../components/DateSelector/DateSelector.component';
import { CurrencyInput } from '../../../../components/CurrencyInput/CurrencyInput.component';

import { ExtendStakeComponentProps } from './ExtendStake.types';

export const ExtendStakeComponent = ({
  open,
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
      isValid
      onClose={onClose}
      title="Extend Fish Stake"
      leftButtonText="Confirm"
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

      <FeeEstimator />
    </DialogForm>
  );
};

const FeeEstimator = () => (
  <Typography>Tx Fee: {formatWeiAmount('30000000000000', 7)} RBTC</Typography>
);
