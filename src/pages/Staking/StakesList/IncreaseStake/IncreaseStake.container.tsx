import { useCallback } from 'react';
import { constants, utils } from 'ethers';
import { useSelector } from 'react-redux';
import { useContractCall } from '../../../../hooks/useContractCall';
import {
  fishTokenSelector,
  stakingContractSelector,
} from '../../../../store/app/app.selectors';
import {
  selectedStakeSelector,
  fishTokenDataSelector,
} from '../../../../store/staking/staking.selectors';
import { StakingFeeEstimator } from '../../Staking.types';

import { SubmitStatusDialog } from '../../../../components/TxDialog/TxDialog.component';

import {
  IncreaseStakeContainerProps,
  IncreaseStakeFormValues,
} from './IncreaseStake.types';
import { IncreaseStakeComponent } from './IncreaseStake.component';

export const IncreaseStakeContainer = ({
  open,
  onClose,
}: IncreaseStakeContainerProps) => {
  const { fishBalance } = useSelector(fishTokenDataSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);
  const staking = useSelector(stakingContractSelector);
  const fishToken = useSelector(fishTokenSelector);

  // ----- approving -----

  const estimateApproveFee: StakingFeeEstimator = useCallback(
    async (amount: string, _: number) => {
      if (!fishToken || !staking) {
        throw new Error('missing data');
      }

      return fishToken.estimateGas.approve(
        staking.address,
        utils.parseEther(amount)
      );
    },
    [fishToken, staking]
  );

  const onApproveStake = async ({
    increaseStakeAmount,
  }: IncreaseStakeFormValues) => {
    if (!staking || !fishToken) {
      throw new Error('missing data');
    }

    const tx = await fishToken.approve(
      staking.address,
      utils.parseEther(increaseStakeAmount)
    );

    return tx;
  };

  const { handleSubmit: handleApprove, ...approveData } =
    useContractCall(onApproveStake);

  // ----- staking -----

  const estimateStakeFee: StakingFeeEstimator = useCallback(
    async (amount: string, _: number) => {
      if (!staking || !selectedStakeData) {
        throw new Error('missing data');
      }

      return staking.estimateGas.stake(
        utils.parseEther(amount),
        selectedStakeData.unlockDate,
        constants.AddressZero,
        constants.AddressZero
      );
    },
    [selectedStakeData, staking]
  );

  const onStake = async ({ increaseStakeAmount }: IncreaseStakeFormValues) => {
    if (!staking || !selectedStakeData) {
      throw new Error('missing data');
    }

    const tx = staking?.stake(
      utils.parseEther(increaseStakeAmount),
      selectedStakeData?.unlockDate,
      constants.AddressZero,
      constants.AddressZero
    );

    return tx;
  };

  const { handleSubmit: handleStake, ...stakeData } = useContractCall(onStake);

  if (!selectedStakeData) {
    return null;
  }

  return (
    <>
      <IncreaseStakeComponent
        open={open}
        onClose={onClose}
        onStake={handleStake}
        fishBalance={fishBalance}
        onApprove={handleApprove}
        estimateStakeFee={estimateStakeFee}
        estimateApproveFee={estimateApproveFee}
        unlockDate={selectedStakeData.unlockDate}
        currentStakeAmount={selectedStakeData.lockedAmount}
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
