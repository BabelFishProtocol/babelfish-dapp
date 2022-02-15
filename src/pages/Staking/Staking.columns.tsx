import React from 'react';

import Typography from '@mui/material/Typography';

import { PrettyTx } from '../../components/PrettyTx/PrettyTx.component';
import { CustomColumn } from '../../components/DataTable/DataTable.types';
import { isRskAddress } from '../../utils/helpers';

export const VotingDelegationColumn: CustomColumn = ({ value }) =>
  isRskAddress(String(value)) ? (
    <>
      Delegated to: <PrettyTx value={value} />
    </>
  ) : (
    <Typography variant="body2">{value}</Typography>
  );
