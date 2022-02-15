import { DataTable } from '../../../components/DataTable/DataTable.component';
import { TableAction } from '../../../components/TableActions/TableActions.types';
import {
  CustomColumn,
  DataTableColumn,
} from '../../../components/DataTable/DataTable.types';
import { TableActionsComponent } from '../../../components/TableActions/TableActions.component';
import { formatTimestamp } from '../../../utils/helpers';

import { VotingDelegationColumn } from '../Staking.columns';
import { VestsListComponentProps, VestsListItem } from './VestsList.types';

const ActionColumn: CustomColumn = () => {
  const handleClick = () => {};

  const actions: TableAction[] = [
    {
      label: 'Delegate',
      onClick: handleClick,
    },
    {
      label: 'Withdraw',
      onClick: handleClick,
    },
  ];

  return <TableActionsComponent actions={actions} />;
};

const vestsColumns: DataTableColumn<VestsListItem>[] = [
  { label: 'Asset', name: 'asset' },
  { label: 'Locked Amount', name: 'lockedAmount' },
  { label: 'Voting Power', name: 'votingPower' },
  {
    label: 'Voting Delegation Power',
    name: 'votingDelegation',
    component: VotingDelegationColumn,
  },
  { label: 'Staking Date', name: 'stakingDate' },
  { label: 'Staking Period', name: 'stakingPeriod' },
  { label: 'Unlock Date', name: 'unlockDate', format: formatTimestamp },
  { label: 'Actions', name: 'unlockDate', component: ActionColumn },
];

export const VestsListComponent = ({ vests }: VestsListComponentProps) => (
  <DataTable
    data={vests}
    columns={vestsColumns}
    tableTitle="Current Vests"
    containerSx={{ p: 1, minHeight: 250 }}
  />
);
