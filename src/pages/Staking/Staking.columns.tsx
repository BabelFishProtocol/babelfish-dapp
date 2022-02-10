import React from 'react';

import Typography from '@mui/material/Typography';

import { PrettyTx } from '../../components/PrettyTx/PrettyTx.component';
import { CustomColumn } from '../../components/DataTable/DataTable.types';

/** TODO: replace with address checker once etheres library is installed */
const mockIsAddress = (val: string | number) => val !== 'No Delegate';

export const VotingDelegationColumn: CustomColumn = ({ value }) =>
  mockIsAddress(value) ? (
    <>
      Delegated to: <PrettyTx value={value} />
    </>
  ) : (
    <Typography variant="body2">{value}</Typography>
  );
