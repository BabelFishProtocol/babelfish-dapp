import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectedVestContractSelector,
  withdrawVestStatusSelector,
} from '../../../../store/vesting/vesting.selectors';
import { selectorsErrors } from '../../../../constants';
import { vestingActions } from '../../../../store/vesting/vesting.slice';
import { SubmitStepsDialog } from '../../../../components/TxDialog/TxDialog.component';

import { FeeEstimator } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';
import { useGetUnlockedVesting } from './WithdrawVest.hooks';
import { WithdrawVestComponent } from './WithdrawVest.component';
import { WithdrawVestFormValues } from './WithdrawVest.fields';
import { WithdrawVestContainerProps } from './WithdrawVest.types';

export const WithdrawVestContainer = ({
  open,
  onClose,
}: WithdrawVestContainerProps) => {
  const dispatch = useDispatch();
  const vesting = useSelector(selectedVestContractSelector);
  const withdrawTx = useSelector(withdrawVestStatusSelector);
  const { amount } = useGetUnlockedVesting();

  const estimateFee: FeeEstimator = useCallback(
    (withdrawTo) => {
      if (!vesting) throw new Error(selectorsErrors.missingData);

      return vesting.estimateGas.withdrawTokens(withdrawTo);
    },
    [vesting]
  );

  if (!vesting) {
    return null;
  }

  const handleWithdraw = (formValues: WithdrawVestFormValues) => {
    dispatch(vestingActions.withdrawVest(formValues));
  };
  const handleReset = () => {
    dispatch(vestingActions.resetWithdrawVest());
  };

  return (
    <>
      <WithdrawVestComponent
        open={open}
        onClose={onClose}
        onWithdraw={handleWithdraw}
        isLocked={amount === '0'}
        currentVestAmount={amount}
        estimateFee={estimateFee}
      />
      {withdrawTx.status !== 'idle' && (
        <SubmitStepsDialog
          successCallback={onClose}
          onClose={handleReset}
          steps={withdrawTx.steps}
          status={withdrawTx.status}
          summary={withdrawTx.summary}
          currentStep={withdrawTx.currentStep}
        />
      )}
    </>
  );
};
