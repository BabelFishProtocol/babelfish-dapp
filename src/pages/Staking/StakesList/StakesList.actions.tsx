import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

import { stakingActions } from '../../../store/staking/staking.slice';

import { TableAction } from '../../../components/TableActions/TableActions.types';
import { CustomColumn } from '../../../components/DataTable/DataTable.types';
import { TableActionsComponent } from '../../../components/TableActions/TableActions.component';
import { isTimeStampLocked } from '../../../utils/helpers';

import { useStakeModalForm } from '../Staking.hooks';
import { ExtendStakeContainer } from './ExtendStake/ExtendStake.container';
import { IncreaseStakeContainer } from './IncreaseStake/IncreaseStake.container';
import { WithdrawStakeContainer } from './WithdrawStake/WithdrawStake.container';
import { DelegateStakeContainer } from './DelegateStake/DelegateStake.container';

export const StakeActionColumn: CustomColumn = ({
  value,
  rowData: { unlockDate },
}) => {
  const dispatch = useDispatch();

  const isActionDisabled = useMemo(
    () => isTimeStampLocked(unlockDate),
    [unlockDate]
  );

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

  const [showDelegateForm, handleOpenDelegateForm, handleCloseDelegateForm] =
    useStakeModalForm(selectStake, clearSelectedStake);

  const actions: TableAction[] = [
    {
      isDisable: true,
      label: 'Increase',
      onClick: handleOpenIncreaseForm,
    },
    {
      isDisable: true,
      label: 'Extend',
      onClick: handleOpenExtendForm,
    },
    {
      label: 'Unstake',
      onClick: handleOpenWithdrawForm,
    },
    {
      isDisable: isActionDisabled,
      label: 'Delegate',
      onClick: handleOpenDelegateForm,
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

      {showDelegateForm && (
        <DelegateStakeContainer
          onClose={handleCloseDelegateForm}
          open={showDelegateForm}
        />
      )}
    </>
  );
};
