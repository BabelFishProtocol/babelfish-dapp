import { useState } from 'react';
import { utils } from 'ethers';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

import { Button } from '../../../components/Button/Button.component';
import { CenteredBox } from '../../../components/PageView/PageView.component';
import { DateSelector } from '../../../components/DateSelector/DateSelector.component';
import { AppDialogTitle } from '../../../components/AppDialog/AppDialog.component';
import { CurrencyInput } from '../../../components/CurrencyInput/CurrencyInput.component';
import { InputWithButtonPillGroup } from '../../../components/InputPillGroup/InputWithButtonPillGroup.component';

import { AddNewStakeComponentProps } from './AddStakeForm.types';

export const AddNewStakeComponent = ({
  open,
  onClose,
  stakes,
  kickoffTs,
}: AddNewStakeComponentProps) => {
  const [unlockDate, setUnlockDate] = useState<number>();

  return (
    <Dialog
      open={open}
      maxWidth="md"
      onClose={onClose}
      PaperProps={{ sx: { width: 600 } }}
    >
      <AppDialogTitle title="Stake Fish" onClose={onClose} />
      <Box
        sx={{
          px: 4,
          pt: 3,
          pb: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <InputWithButtonPillGroup
          symbol="XUSD"
          title="Amount To Stake"
          totalAmount={utils.parseUnits('2.234')}
        />

        <DateSelector
          value={unlockDate}
          stakes={stakes}
          kickoffTs={kickoffTs}
          onChange={setUnlockDate}
        />

        <CurrencyInput
          disabled
          symbol=""
          value="100.000"
          labelSx={{ mt: 3 }}
          title="Voting Power received"
        />

        <Typography sx={{ mt: 4 }}>Tx Fee: 12.000 RBTC</Typography>
      </Box>

      <CenteredBox sx={{ width: '100%', gap: 3, p: 3 }}>
        <Button sx={{ flexGrow: 1 }}>Stake</Button>
        <Button sx={{ flexGrow: 1 }} variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </CenteredBox>
    </Dialog>
  );
};
