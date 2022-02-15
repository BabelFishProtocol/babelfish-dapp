import React from 'react';

import {
  CustomColumn,
  DataTableColumn,
} from '../../../components/DataTable/DataTable.types';
import { DataTable } from '../../../components/DataTable/DataTable.component';
import { TableAction } from '../../../components/TableActions/TableActions.types';
import { TableActionsComponent } from '../../../components/TableActions/TableActions.component';
import { formatTimestamp } from '../../../utils/helpers';
import { StakeListItem } from '../../../store/staking/staking.state';

import { VotingDelegationColumn } from '../Staking.columns';
import { StakesListComponentProps } from './StakesList.types';

const StakeActionColumn: CustomColumn = () => {
  const handleClick = () => {};

  const actions: TableAction[] = [
    {
      label: 'Increase',
      onClick: handleClick,
    },
    {
      label: 'Extend',
      onClick: handleClick,
    },
    {
      label: 'Unstake',
      onClick: handleClick,
    },
    {
      label: 'Delegate',
      onClick: handleClick,
    },
  ];

  return <TableActionsComponent actions={actions} />;
};

const stakesColumns: DataTableColumn<StakeListItem>[] = [
  { label: 'Asset', name: 'asset' },
  { label: 'Locked Amount', name: 'lockedAmount' },
  { label: 'Voting Power', name: 'votingPower' },
  {
    label: 'Voting Delegation Power',
    name: 'votingDelegation',
    component: VotingDelegationColumn,
  },
  { label: 'Staking Period', name: 'stakingPeriod' },
  {
    label: 'Unlock Date',
    name: 'unlockDate',
    format: formatTimestamp,
  },
  { label: 'Actions', name: 'unlockDate', component: StakeActionColumn },
];

export const StakesListComponent = ({
  stakes,
  state,
}: StakesListComponentProps) => (
  <DataTable
    data={stakes}
    columns={stakesColumns}
    isLoading={state === 'loading'}
    tableTitle="Current Stakes"
    containerSx={{ p: 1, minHeight: 250 }}
  />
);
