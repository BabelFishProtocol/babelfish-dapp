import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { stakingActions } from '../../../store/staking/staking.slice';

import { TableAction } from '../../../components/TableActions/TableActions.types';
import { CustomColumn } from '../../../components/DataTable/DataTable.types';
import { TableActionsComponent } from '../../../components/TableActions/TableActions.component';

import { ExtendStakeContainer } from './ExtendStake/ExtendStake.container';
import { IncreaseStakeContainer } from './IncreaseStake/IncreaseStake.container';

export const StakeActionColumn: CustomColumn = ({ value }) => {
  const dispatch = useDispatch();
  const [showIncreaseForm, setShowIncreaseForm] = useState(false);
  const [showExtendForm, setShowExtendForm] = useState(false);

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

  const handleExtendStake = () => {
    selectStake();
    setShowExtendForm(true);
  };
  const handleCloseExtendStake = () => {
    clearSelectedStake();
    setShowExtendForm(false);
  };

  const actions: TableAction[] = [
    {
      label: 'Increase',
      onClick: handeIncreaseStake,
    },
    {
      label: 'Extend',
      onClick: handleExtendStake,
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

      {showExtendForm && (
        <ExtendStakeContainer
          onClose={handleCloseExtendStake}
          open={showExtendForm}
        />
      )}
    </>
  );
};
