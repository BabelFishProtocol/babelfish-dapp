import { useDispatch } from 'react-redux';

import { stakingActions } from '../../../store/staking/staking.slice';

import { TableAction } from '../../../components/TableActions/TableActions.types';
import { CustomColumn } from '../../../components/DataTable/DataTable.types';
import { TableActionsComponent } from '../../../components/TableActions/TableActions.component';

import { useStakeModalForm } from '../Staking.hooks';
import { DelegateVestContainer } from './DelegateVest/DelegateVest.container';
import { WithdrawVestContainer } from './WithdrawVest/WithdrawVest.container';
import { VestListItem } from '../../../store/staking/staking.state';

export const VestsActionColumn: CustomColumn<VestListItem> = ({ value }) => {
  const dispatch = useDispatch();

  const selectVest = () => {
    dispatch(stakingActions.selectVest(Number(value)));
  };
  const clearSelectedVest = () => {
    dispatch(stakingActions.clearSelectedVest());
  };

  const [showDelegateForm, handleOpenDelegateForm, handleCloseDelegateForm] =
    useStakeModalForm(selectVest, clearSelectedVest);

  const [showWithdrawForm, handleOpenWithdrawForm, handleCloseWithdrawForm] =
    useStakeModalForm(selectVest, clearSelectedVest);

  const actions: TableAction[] = [
    {
      label: 'Delegate',
      onClick: handleOpenDelegateForm,
    },
    {
      label: 'Withdraw',
      onClick: handleOpenWithdrawForm,
    },
  ];

  return (
    <>
      <TableActionsComponent actions={actions} />

      {showDelegateForm && (
        <DelegateVestContainer
          onClose={handleCloseDelegateForm}
          open={showDelegateForm}
        />
      )}

      {showWithdrawForm && (
        <WithdrawVestContainer
          onClose={handleCloseWithdrawForm}
          open={showWithdrawForm}
        />
      )}
    </>
  );
};
