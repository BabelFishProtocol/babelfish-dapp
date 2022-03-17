import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SubmitStatusDialog } from '../../../../components/TxDialog/TxDialog.component';
import { useContractCall } from '../../../../hooks/useContractCall';
import { accountSelector } from '../../../../store/app/app.selectors';
import {
  selectedVestSelector,
  selectedVestContractSelector,
} from '../../../../store/staking/staking.selectors';
import { WithdrawFeeEstimator } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';

import { WithdrawVestComponent } from './WithdrawVest.component';
import { useGetUnlockedVesting } from './WithdrawVest.hooks';
import { WithdrawVestContainerProps } from './WithdrawVest.types';

export const WithdrawVestContainer = ({
  open,
  onClose,
}: WithdrawVestContainerProps) => {
  const account = useSelector(accountSelector);
  const selectedVestData = useSelector(selectedVestSelector);
  const vesting = useSelector(selectedVestContractSelector);

  const { amount } = useGetUnlockedVesting();

  const handleWithdraw = async () => {
    if (!vesting || !selectedVestData || !account) {
      throw new Error('missing data');
    }

    return vesting.withdrawTokens(selectedVestData.address);
  };

  const { handleSubmit: onWithdraw, ...withdrawTxData } =
    useContractCall(handleWithdraw);

  const estimateFee: WithdrawFeeEstimator = useCallback(
    (withdrawTo) => {
      if (!vesting || !selectedVestData) {
        throw new Error('missing data');
      }

      return vesting.estimateGas.withdrawTokens(withdrawTo);
    },
    [selectedVestData, vesting]
  );

  if (!selectedVestData) {
    return null;
  }

  return (
    <>
      <WithdrawVestComponent
        open={open}
        onClose={onClose}
        onWithdraw={onWithdraw}
        isLocked={amount === '0'}
        currentVestAmount={selectedVestData.lockedAmount}
        estimateFee={estimateFee}
      />
      {withdrawTxData.status !== 'idle' && (
        <SubmitStatusDialog
          operationName="Withdrawing stake"
          successCallback={onClose}
          {...withdrawTxData}
        />
      )}
    </>
  );
};
