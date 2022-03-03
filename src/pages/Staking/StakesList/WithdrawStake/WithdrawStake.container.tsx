import { utils } from 'ethers';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  accountSelector,
  stakingContractSelector,
} from '../../../../store/app/app.selectors';
import {
  stakingConstantsSelector,
  selectedStakeSelector,
  isSelectedStakeLockedSelector,
} from '../../../../store/staking/staking.selectors';
import { useContractCall } from '../../../../hooks/useContractCall';
import { SubmitStatusDialog } from '../../../../components/TxDialog/TxDialog.component';

import { StakingFeeEstimator } from '../../Staking.types';
import { WithdrawStakeComponent } from './WithdrawStake.component';
import { WithdrawStakeFormValues } from './WithdrawStake.fields';
import { WithdrawStakeContainerProps } from './WithdrawStake.types';

const useWithdrawCalculations = () => {
  const account = useSelector(accountSelector);
  const staking = useSelector(stakingContractSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);

  const [forfeitWithdraw, setForfeitWithdraw] = useState('0');
  const [forfeitPercent, setForfeitPercent] = useState('0');

  const calculateFeeAndForfeit: StakingFeeEstimator = useCallback(
    async (withdrawAmount) => {
      if (!staking || !selectedStakeData || !account) {
        throw new Error('missing data');
      }

      const getPunishmentAmount = async () => {
        const [, punishment] = await staking.getWithdrawAmounts(
          utils.parseEther(withdrawAmount),
          selectedStakeData.unlockDate
        );

        setForfeitWithdraw(punishment.toString());

        setForfeitPercent(
          punishment
            .mul(100)
            .div(selectedStakeData.lockedAmount)
            .toNumber()
            .toFixed(1)
        );
      };

      const estimateFee = () =>
        staking.estimateGas.withdraw(
          utils.parseEther(withdrawAmount),
          selectedStakeData.unlockDate,
          account
        );

      const [estimatedFee] = await Promise.all([
        estimateFee(),
        getPunishmentAmount(),
      ]);

      return estimatedFee;
    },
    [account, selectedStakeData, staking]
  );

  return {
    forfeitPercent,
    forfeitWithdraw,
    calculateFeeAndForfeit,
  };
};

export const WithdrawStakeContainer = ({
  open,
  onClose,
}: WithdrawStakeContainerProps) => {
  const account = useSelector(accountSelector);
  const staking = useSelector(stakingContractSelector);
  const { kickoffTs } = useSelector(stakingConstantsSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);
  const isLocked = useSelector(isSelectedStakeLockedSelector);

  const { forfeitPercent, forfeitWithdraw, calculateFeeAndForfeit } =
    useWithdrawCalculations();

  const handleWithdraw = async ({
    withdrawStakeAmount,
  }: WithdrawStakeFormValues) => {
    if (!staking || !selectedStakeData || !account) {
      throw new Error('missing data');
    }

    return staking.withdraw(
      utils.parseEther(withdrawStakeAmount),
      selectedStakeData.unlockDate,
      account
    );
  };

  const { handleSubmit: onWithdraw, ...withdrawTxData } =
    useContractCall(handleWithdraw);

  const { forfeitPercent, forfeitWithdraw, calculateFeeAndForfeit } =
    useWithdrawCalculations();

  const handleWithdraw = async ({
    withdrawStakeAmount,
  }: WithdrawStakeFormValues) => {
    if (!staking || !selectedStakeData || !account) {
      throw new Error('missing data');
    }

    return staking.withdraw(
      utils.parseEther(withdrawStakeAmount),
      selectedStakeData.unlockDate,
      account
    );
  };

  const { handleSubmit: onWithdraw, ...withdrawTxData } =
    useContractCall(handleWithdraw);

  if (!kickoffTs || !selectedStakeData) {
    return null;
  }

  return (
    <>
      <WithdrawStakeComponent
        open={open}
        onClose={onClose}
        isLocked={!!isLocked}
        onWithdraw={onWithdraw}
        forfeitPercent={forfeitPercent}
        forfeitWithdraw={forfeitWithdraw}
        calculateFeeAndForfeit={calculateFeeAndForfeit}
        currentStakeAmount={selectedStakeData.lockedAmount}
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
