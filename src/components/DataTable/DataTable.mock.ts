import { VestListItem } from '../../store/vesting/vesting.state';
import { DataTableColumn, DataTableProps } from './DataTable.types';

export const vestListColumns: DataTableColumn<VestListItem>[] = [
  {
    label: 'Asset',
    name: 'asset',
  },
  {
    label: 'Locked Amount',
    name: 'lockedAmount',
  },
  {
    label: 'Voting Delegation Power',
    name: 'votingDelegation',
  },
  {
    label: 'Staking Date',
    name: 'stakingPeriodStart',
  },
  {
    label: 'Staking Period',
    name: 'unlockDate',
  },
  {
    label: 'Unlock Date',
    name: 'unlockDate',
  },
  {
    label: 'Actions',
    name: 'unlockDate',
  },
];

export const vestListItem: VestListItem[] = [
  {
    asset: 'FISH',
    lockedAmount: '9552856700000000000000',
    votingDelegation: '0x0000000000000000000000000000000000000000',
    stakingPeriodStart: 1659571200,
    unlockDate: 1659571200,
    address: '0x0000000000000000000000000000000000000000',
    addressType: 'team',
    cliff: 2419200,
  },
  {
    asset: 'FISH',
    lockedAmount: '2552856700000000000000',
    votingDelegation: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    stakingPeriodStart: 1659571200,
    unlockDate: 1639008000,
    address: '0x84e907f6B903A393E14FE549113137CA6483b5ef',
    addressType: 'genesis',
    cliff: 2419200,
  },
];

export const mockDataTable: DataTableProps<VestListItem> = {
  tableTitle: 'Current Vests',
  tableEmptyMessage: 'No stakes yet.',
  state: 'success',
  columns: vestListColumns,
  data: vestListItem,
  containerSx: {
    p: 1,
    minHeight: 250,
  },
};
