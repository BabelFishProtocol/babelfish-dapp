import React from 'react';
import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';

import {
  formatWeiAmount,
  isRskAddress,
  timestampToDate,
} from '../../utils/helpers';
import { PrettyTx } from '../../components/PrettyTx/PrettyTx.component';
import {
  BaseRowData,
  CellParser,
  CustomColumn,
} from '../../components/DataTable/DataTable.types';
import {
  StakeListItem,
  VestsListItem,
} from '../../store/staking/staking.state';

const mockAccount = '0x0000000000000000000000000000000000000000';

type ColumnComponent = CustomColumn<StakeListItem | VestsListItem>;

export const VotingDelegationColumn: ColumnComponent = ({ value }) => {
  const account = mockAccount;

  return isRskAddress(String(value)) && value !== account ? (
    <>
      Delegated to: <PrettyTx value={value} />
    </>
  ) : (
    <Typography variant="body2">No Delegate</Typography>
  );
};

export const getAmountColumn =
  <RowData extends BaseRowData>(name: keyof RowData): CustomColumn<RowData> =>
  ({ rowData }) =>
    (
      <>
        {formatWeiAmount(rowData[name])} {rowData.asset}
      </>
    );

export const formatStakingPeriod: CellParser = (val) => {
  const daysDiff = Math.abs(dayjs().diff(timestampToDate(Number(val)), 'days'));

  return `${daysDiff} days`;
};

export const formatFishAmountColumn: CellParser = (val) =>
  `${formatWeiAmount(val)} FISH`;
