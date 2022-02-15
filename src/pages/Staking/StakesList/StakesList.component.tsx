import React from 'react';

import { formatTimestampToUTC } from '../../../utils/helpers';
import { StakeListItem } from '../../../store/staking/staking.state';

import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';

import { StakeActionColumn } from './StakeList.actions';
import { VotingDelegationColumn } from '../Staking.columns';
import { StakesListComponentProps } from './StakesList.types';

const stakesColumns: DataTableColumn<StakeListItem>[] = [
  { label: 'Asset', name: 'asset' },
  {
    label: 'Locked Amount',
    name: 'lockedAmount',
    format: (val) => `${val} FISH`,
  },
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
    format: formatTimestampToUTC,
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
