import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';
import { formatTimestampToUTC } from '../../../utils/helpers';
import { getAmountColumn } from '../Staking.columns';
import {
  StakingHistoryComponentProps,
  StakingHistoryListItem,
} from './StakingHistory.types';

const stakingHistoryColumns: DataTableColumn<StakingHistoryListItem>[] = [
  { name: 'asset', label: 'Asset' },
  {
    name: 'stakedAmount',
    label: 'Staked Amount',
    component: getAmountColumn('stakedAmount'),
  },
  { name: 'stakingDate', label: 'Staking Date', format: formatTimestampToUTC },
  {
    name: 'totalStaked',
    label: 'Total Staked',
    component: getAmountColumn('totalStaked'),
  },
];

export const StakingHistoryComponent = ({
  stakes,
}: StakingHistoryComponentProps) => (
  <DataTable
    data={stakes}
    tableTitle="Staking History"
    columns={stakingHistoryColumns}
    containerSx={{ p: 1, minHeight: 250 }}
  />
);
