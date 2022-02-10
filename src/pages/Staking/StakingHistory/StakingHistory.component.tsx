import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';
import {
  StakingHistoryComponentProps,
  StakingHistoryListItem,
} from './StakingHistory.types';

const stakingHistoryColumns: DataTableColumn<StakingHistoryListItem>[] = [
  { name: 'asset', label: 'Asset' },
  { name: 'stakedAmount', label: 'Staked Amount' },
  { name: 'stakingDate', label: 'Staking Date' },
  { name: 'totalStaked', label: 'Total Staked' },
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
