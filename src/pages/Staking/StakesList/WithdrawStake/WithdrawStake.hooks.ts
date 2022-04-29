import { utils } from 'ethers';
import { useSelector } from 'react-redux';
import { useState, useCallback } from 'react';

import {
  accountSelector,
  stakingContractSelector,
} from '../../../../store/app/app.selectors';
import { selectorsErrors } from '../../../../constants';
import { selectedStakeSelector } from '../../../../store/staking/staking.selectors';
import { StakingFeeEstimator } from '../../Staking.types';

export const useWithdrawCalculations = () => {
  const account = useSelector(accountSelector);
  const staking = useSelector(stakingContractSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);

  const [forfeitWithdraw, setForfeitWithdraw] = useState('0');
  const [forfeitPercent, setForfeitPercent] = useState('0');

  const calculateFeeAndForfeit: StakingFeeEstimator = useCallback(
    async (withdrawAmount) => {
      if (!staking || !selectedStakeData || !account) {
        throw new Error(selectorsErrors.missingData);
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
