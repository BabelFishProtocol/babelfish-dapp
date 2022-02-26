import React from 'react';

import { formatTimestamp } from '../../../utils/helpers';
import { StakeListItem } from '../../../store/staking/staking.state';

import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';

import { StakeActionColumn } from './StakesList.actions';
import {
  formatStakingPeriod,
  getAmountColumn,
  VotingDelegationColumn,
} from '../Staking.columns';
import { StakesListComponentProps } from './StakesList.types';

const stakesColumns: DataTableColumn<StakeListItem>[] = [
  { label: 'Asset', name: 'asset' },
  {
    label: 'Locked Amount',
    name: 'lockedAmount',
    component: getAmountColumn('lockedAmount'),
  },
  // { label: 'Voting Power', name: 'votingPower' },
  {
    label: 'Voting Delegation Power',
    name: 'votingDelegation',
    component: VotingDelegationColumn,
  },
  {
    label: 'Staking Period',
    name: 'unlockDate',
    format: formatStakingPeriod,
  },
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
