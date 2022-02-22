import React from 'react';

import Typography from '@mui/material/Typography';

import { PrettyTx } from '../../components/PrettyTx/PrettyTx.component';
import { CustomColumn } from '../../components/DataTable/DataTable.types';
import { isRskAddress } from '../../utils/helpers';

const mockAccount = '0x0000000000000000000000000000000000000000';

export const VotingDelegationColumn: CustomColumn = ({ value }) => {
  const account = mockAccount;

  return isRskAddress(String(value)) && value !== account ? (
    <>
      Delegated to: <PrettyTx value={value} />
    </>
  ) : (
    <Typography variant="body2">No Delegate</Typography>
  );
};
