import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber, constants, utils } from 'ethers';

import {
  accountSelector,
  fishTokenSelector,
  stakingContractSelector,
} from '../../../store/app/app.selectors';

import {
  fishTokenDataSelector,
  stakingConstantsSelector,
  stakesDatesSelector,
} from '../../../store/staking/staking.selectors';

import {
  AddNewStakeContainerProps,
  AddNewStakeFormValues,
} from './AddNewStake.types';
import { StakingFeeEstimator } from '../Staking.hooks';
import { AddNewStakeComponent } from './AddNewStake.component';

export const AddNewStakeContainer = ({
  open,
  onClose,
}: AddNewStakeContainerProps) => {
  const currentStakes = useSelector(stakesDatesSelector);
  const { kickoffTs } = useSelector(stakingConstantsSelector);
  const account = useSelector(accountSelector);
  const { fishBalance, allowanceForStaking } = useSelector(
    fishTokenDataSelector
  );
  const staking = useSelector(stakingContractSelector);
  const fishToken = useSelector(fishTokenSelector);

  const estimateStakeFee: StakingFeeEstimator = useCallback(
    async (amount: string, timestamp: number) =>
      staking?.estimateGas.stake(
        utils.parseEther(amount),
        timestamp,
        constants.AddressZero,
        constants.AddressZero
      ),
    [staking?.estimateGas]
  );

  const esmimateApproveFee: StakingFeeEstimator = useCallback(
    async (amount: string, _: number) =>
      fishToken?.estimateGas.approve(
        staking?.address as string,
        utils.parseEther(amount)
      ),
    [fishToken?.estimateGas, staking?.address]
  );

  if (!kickoffTs || !staking || !account) {
    return null;
  }

  const onStake = async (formValues: AddNewStakeFormValues) => {
    console.log('stake', { formValues });
  };

  const onApprove = async ({ stakeAmount }: AddNewStakeFormValues) => {
    console.log({ stakeAmount, allowanceForStaking });
    const missingAllowance = utils
      .parseEther(stakeAmount)
      .sub(BigNumber.from(allowanceForStaking));

    const tx = await fishToken?.approve(staking.address, missingAllowance);

    console.log({ tx });

    await tx?.wait();
  };

  return (
    <AddNewStakeComponent
      open={open}
      onClose={onClose}
      onStake={onStake}
      onApprove={onApprove}
      stakes={currentStakes}
      fishBalance={fishBalance}
      kickoffTs={kickoffTs}
      estimateStakeFee={estimateStakeFee}
      esmimateApproveFee={esmimateApproveFee}
    />
  );
};
