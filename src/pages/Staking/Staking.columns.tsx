import React from 'react';
import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';

import { useSelector } from 'react-redux';
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
import { StakeListItem } from '../../store/staking/staking.state';
import { accountSelector } from '../../store/app/app.selectors';
import { VestListItem } from '../../store/vesting/vesting.state';
import { StakingHistoryListItem } from './StakingHistory/StakingHistory.types';

type ColumnComponent = CustomColumn<StakeListItem | VestListItem>;
type HashColumnComponent = CustomColumn<StakingHistoryListItem>;

export const VotingDelegationColumn: ColumnComponent = ({ value }) => {
  const account = useSelector(accountSelector);

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
  const parsedDate = timestampToDate(Number(val));

  const isLocked = dayjs().isAfter(parsedDate);
  const daysDiff = Math.abs(dayjs().diff(parsedDate, 'days'));

  return isLocked ? 'Expired' : `${daysDiff} days`;
};

export const formatFishAmountColumn: CellParser = (val) =>
  `${formatWeiAmount(val)} FISH`;

export const TxHashColumn: HashColumnComponent = ({ value }) => (
  <PrettyTx value={value} />
);
