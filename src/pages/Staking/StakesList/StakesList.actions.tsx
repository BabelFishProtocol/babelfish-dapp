import { useDispatch } from 'react-redux';

import { stakingActions } from '../../../store/staking/staking.slice';

import { TableAction } from '../../../components/TableActions/TableActions.types';
import { CustomColumn } from '../../../components/DataTable/DataTable.types';
import { TableActionsComponent } from '../../../components/TableActions/TableActions.component';

import { useStakeModalForm } from './StakesList.hooks';
import { ExtendStakeContainer } from './ExtendStake/ExtendStake.container';
import { IncreaseStakeContainer } from './IncreaseStake/IncreaseStake.container';
import { WithdrawStakeContainer } from './WithdrawStake/WithdrawStake.container';

export const StakeActionColumn: CustomColumn = ({ value }) => {
  const dispatch = useDispatch();

  const selectStake = () => {
    dispatch(stakingActions.selectStake(Number(value)));
  };
  const clearSelectedStake = () => {
    dispatch(stakingActions.clearSelectedStake());
  };

  const [showIncreaseForm, handleOpenIncreaseForm, handleCloseIncreaseForm] =
    useStakeModalForm(selectStake, clearSelectedStake);

  const [showExtendForm, handleOpenExtendForm, handleCloseExtendForm] =
    useStakeModalForm(selectStake, clearSelectedStake);

  const [showWithdrawForm, handleOpenWithdrawForm, handleCloseWithdrawForm] =
    useStakeModalForm(selectStake, clearSelectedStake);

  const handleWithdrawStake = () => {
    selectStake();
    setShowWithdrawForm(true);
  };
  const handleCloseWithdrawForm = () => {
    clearSelectedStake();
    setShowWithdrawForm(false);
  };

  const actions: TableAction[] = [
    {
      label: 'Increase',
      onClick: handleOpenIncreaseForm,
    },
    {
      label: 'Extend',
      onClick: handleOpenExtendForm,
    },
    {
      label: 'Unstake',
      onClick: handleOpenWithdrawForm,
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
          onClose={handleCloseIncreaseForm}
          open={showIncreaseForm}
        />
      )}

      {showExtendForm && (
        <ExtendStakeContainer
          onClose={handleCloseExtendForm}
          open={showExtendForm}
        />
      )}

      {showWithdrawForm && (
        <WithdrawStakeContainer
          onClose={handleCloseWithdrawForm}
          open={showWithdrawForm}
        />
      )}
    </>
  );
};
