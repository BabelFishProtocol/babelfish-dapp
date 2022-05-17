import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';
import { formatTimestamp } from '../../../utils/helpers';
import { getAmountColumn, TxHashColumn } from '../Staking.columns';
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
  { name: 'unlockDate', label: 'Unlock Date', format: formatTimestamp },
  { name: 'txHash', label: 'Tx Hash', component: TxHashColumn },
  {
    name: 'totalStaked',
    label: 'Total Staked',
    component: getAmountColumn('totalStaked'),
  },
];

export const StakingHistoryComponent = ({
  state,
  stakes,
}: StakingHistoryComponentProps) => (
  <DataTable
    data={stakes}
    state={state}
    tableTitle="Staking History"
    tableEmptyMessage="No stakes yet."
    columns={stakingHistoryColumns}
    containerSx={{ p: 2, minHeight: 250 }}
  />
);
