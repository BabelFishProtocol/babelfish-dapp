import { formatTimestamp } from '../../../utils/helpers';
import { VestListItem } from '../../../store/vesting/vesting.state';

import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';

import {
  formatStakingPeriod,
  getAmountColumn,
  VotingDelegationColumn,
} from '../Staking.columns';
import { VestsListComponentProps } from './VestsList.types';
import { VestsActionColumn } from './VestsList.actions';

const vestsColumns: DataTableColumn<VestListItem>[] = [
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
    label: 'Staking Date',
    name: 'stakingPeriodStart',
    format: formatTimestamp,
  },
  { label: 'Staking Period', name: 'unlockDate', format: formatStakingPeriod },
  { label: 'Unlock Date', name: 'unlockDate', format: formatTimestamp },
  { label: 'Actions', name: 'unlockDate', component: VestsActionColumn },
];

export const VestsListComponent = ({
  vests,
  state,
}: VestsListComponentProps) => (
  <DataTable
    data={vests}
    state={state}
    columns={vestsColumns}
    tableTitle="Current Vests"
    tableEmptyMessage="You don't have any vesting contracts."
    containerSx={{ p: 2, minHeight: 250 }}
  />
);
