import { useDispatch } from 'react-redux';

import { stakingActions } from '../../../store/staking/staking.slice';

import { TableAction } from '../../../components/TableActions/TableActions.types';
import { CustomColumn } from '../../../components/DataTable/DataTable.types';
import { TableActionsComponent } from '../../../components/TableActions/TableActions.component';

import { useStakeModalForm } from '../Staking.hooks';
import { DelegateVestContainer } from './DelegateVest/DelegateVest.container';

export const VestsActionColumn: CustomColumn = ({ value }) => {
  const dispatch = useDispatch();

  const selectVest = () => {
    dispatch(stakingActions.selectVest(Number(value)));
  };
  const clearSelectedVest = () => {
    dispatch(stakingActions.clearSelectedVest());
  };

  const [showDelegateForm, handleOpenDelegateForm, handleCloseDelegateForm] =
    useStakeModalForm(selectVest, clearSelectedVest);

  const actions: TableAction[] = [
    {
      label: 'Delegate',
      onClick: handleOpenDelegateForm,
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
    </>
  );
};
