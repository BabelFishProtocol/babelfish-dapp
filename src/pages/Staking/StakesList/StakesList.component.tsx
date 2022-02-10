import React from 'react';

import {
  CustomColumn,
  DataTableColumn,
} from '../../../components/DataTable/DataTable.types';
import { DataTable } from '../../../components/DataTable/DataTable.component';
import { TableAction } from '../../../components/TableActions/TableActions.types';
import { TableActionsComponent } from '../../../components/TableActions/TableActions.component';

import { VotingDelegationColumn } from '../Staking.columns';
import { StakeListItem, StakesListComponentProps } from './StakesList.types';

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
  { label: 'Unlock Date', name: 'unlockDate' },
  { label: 'Actions', name: 'unlockDate', component: StakeActionColumn },
];

export const StakesListComponent = ({ stakes }: StakesListComponentProps) => (
  <DataTable
    data={stakes}
    columns={stakesColumns}
    tableTitle="Current Stakes"
    containerSx={{ p: 1, minHeight: 250 }}
  />
);
