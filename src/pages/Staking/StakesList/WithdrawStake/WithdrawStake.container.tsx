import { useDispatch, useSelector } from 'react-redux';

import {
  selectedStakeSelector,
  isSelectedStakeLockedSelector,
  withdrawalStatusSelector,
} from '../../../../store/staking/staking.selectors';
import { stakingActions } from '../../../../store/staking/staking.slice';
import { SubmitStepsDialog } from '../../../../components/TxDialog/TxDialog.component';

import { WithdrawStakeComponent } from './WithdrawStake.component';
import { WithdrawStakeFormValues } from './WithdrawStake.fields';
import { useWithdrawCalculations } from './WithdrawStake.hooks';
import { WithdrawStakeContainerProps } from './WithdrawStake.types';

export const WithdrawStakeContainer = ({
  open,
  onClose,
}: WithdrawStakeContainerProps) => {
  const dispatch = useDispatch();
  const isLocked = useSelector(isSelectedStakeLockedSelector);
  const submitTx = useSelector(withdrawalStatusSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);

  const { forfeitPercent, forfeitWithdraw, calculateFeeAndForfeit } =
    useWithdrawCalculations();

  const handleWithdraw = (formValues: WithdrawStakeFormValues) => {
    dispatch(stakingActions.withdrawStake(formValues));
  };

  const handleResetCallData = () => {
    dispatch(stakingActions.resetExtend());
  };

  if (!selectedStakeData) {
    return null;
  }

  return (
    <>
      <WithdrawStakeComponent
        open={open}
        onClose={onClose}
        isLocked={!!isLocked}
        onWithdraw={handleWithdraw}
        forfeitPercent={forfeitPercent}
        forfeitWithdraw={forfeitWithdraw}
        calculateFeeAndForfeit={calculateFeeAndForfeit}
        currentStakeAmount={selectedStakeData.lockedAmount}
      />

      {submitTx.status !== 'idle' && (
        <SubmitStepsDialog
          successCallback={onClose}
          onClose={handleResetCallData}
          steps={submitTx.steps}
          status={submitTx.status}
          summary={submitTx.summary}
          currentStep={submitTx.currentStep}
        />
      )}
    </>
  );
};
