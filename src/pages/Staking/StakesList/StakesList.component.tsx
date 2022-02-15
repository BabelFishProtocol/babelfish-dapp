import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
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
import { IncreaseStakeContainer } from './IncreaseStake/IncreaseStake.container';
import { stakingActions } from '../../../store/staking/staking.slice';

const StakeActionColumn: CustomColumn = ({ value }) => {
  const dispatch = useDispatch();
  const [showIncreaseForm, setShowIncreaseForm] = useState(false);

  const selectStake = () => {
    dispatch(stakingActions.selectStake(Number(value)));
  };
  const clearSelectedStake = () => {
    dispatch(stakingActions.clearSelectedStake());
  };

  const handeIncreaseStake = () => {
    selectStake();
    setShowIncreaseForm(true);
  };
  const handleCloseIncreaseStake = () => {
    clearSelectedStake();
    setShowIncreaseForm(false);
  };

  const actions: TableAction[] = [
    {
      label: 'Increase',
      onClick: handeIncreaseStake,
    },
    {
      label: 'Extend',
      onClick: selectStake,
    },
    {
      label: 'Unstake',
      onClick: selectStake,
    },
    {
      label: 'Delegate',
      onClick: selectStake,
    },
  ];

  return (
    <>
      <TableActionsComponent actions={actions} />
      {showIncreaseForm && (
        <IncreaseStakeContainer
          onClose={handleCloseIncreaseStake}
          open={showIncreaseForm}
        />
      )}
    </>
  );
};

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
