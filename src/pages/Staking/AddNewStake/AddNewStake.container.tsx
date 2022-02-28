import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { constants, utils } from 'ethers';

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
import { ONE_DAY } from '../../../constants';
import { useContractCall } from '../../../hooks/useContractCall';

import { SubmitStatusDialog } from '../../../components/TxDialog/TxDialog.component';

import { StakingFeeEstimator } from '../Staking.types';
import {
  AddNewStakeContainerProps,
  AddNewStakeFormValues,
} from './AddNewStake.types';
import { AddNewStakeComponent } from './AddNewStake.component';

export const AddNewStakeContainer = ({
  open,
  onClose,
}: AddNewStakeContainerProps) => {
  const currentStakes = useSelector(stakesDatesSelector);
  const account = useSelector(accountSelector);
  const staking = useSelector(stakingContractSelector);
  const fishToken = useSelector(fishTokenSelector);
  const { kickoffTs } = useSelector(stakingConstantsSelector);
  const { fishBalance } = useSelector(fishTokenDataSelector);

  // ----- approving -----

  const esmimateApproveFee: StakingFeeEstimator = useCallback(
    async (amount: string, _: number) =>
      fishToken?.estimateGas.approve(
        staking?.address as string,
        utils.parseEther(amount)
      ),
    [fishToken?.estimateGas, staking?.address]
  );

  const onApproveStake = async ({ stakeAmount }: AddNewStakeFormValues) => {
    const missingAllowance = utils.parseEther(stakeAmount);

    const tx = await fishToken?.approve(
      staking?.address as string,
      missingAllowance
    );

    return tx;
  };

  const { handleSubmit: handleApprove, ...approveData } =
    useContractCall(onApproveStake);

  // ----- staking -----

  const estimateStakeFee: StakingFeeEstimator = useCallback(
    async (amount: string, timestamp: number) =>
      staking?.estimateGas.stake(
        utils.parseEther(amount),
        timestamp + ONE_DAY,
        constants.AddressZero,
        constants.AddressZero
      ),
    [staking?.estimateGas]
  );

  const onStake = async ({
    stakeAmount,
    unlockDate,
  }: AddNewStakeFormValues) => {
    const tx = staking?.stake(
      utils.parseEther(stakeAmount),
      unlockDate + ONE_DAY, // adding 24 hours to date to make sure contract will not choose previous period,
      constants.AddressZero,
      constants.AddressZero
    );

    return tx;
  };

  const { handleSubmit: handleStake, ...stakeData } = useContractCall(onStake);

  if (!kickoffTs || !staking || !account) {
    return null;
  }

  return (
    <>
      <AddNewStakeComponent
        open={open}
        onClose={onClose}
        onStake={handleStake}
        onApprove={handleApprove}
        kickoffTs={kickoffTs}
        stakes={currentStakes}
        fishBalance={fishBalance}
        estimateStakeFee={estimateStakeFee}
        esmimateApproveFee={esmimateApproveFee}
      />

      {approveData.status !== 'idle' && (
        <SubmitStatusDialog operationName="Approving" {...approveData} />
      )}

      {stakeData.status !== 'idle' && (
        <SubmitStatusDialog
          operationName="Staking"
          successCallback={onClose}
          {...stakeData}
        />
      )}
    </>
  );
};
