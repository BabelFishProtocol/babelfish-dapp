import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useContractCall } from '../../../../hooks/useContractCall';
import { stakingContractSelector } from '../../../../store/app/app.selectors';
import {
  stakesDatesSelector,
  selectedStakeSelector,
  stakingConstantsSelector,
} from '../../../../store/staking/staking.selectors';
import { StakingFeeEstimator } from '../../Staking.types';

import { SubmitStatusDialog } from '../../../../components/TxDialog/TxDialog.component';

import { ExtendStakeValues } from './ExtendStake.fields';
import { ExtendStakeComponent } from './ExtendStake.component';
import { ExtendStakeContainerProps } from './ExtendStake.types';
import { selectorsErrors } from '../../../../constants';

export const ExtendStakeContainer = ({
  open,
  onClose,
}: ExtendStakeContainerProps) => {
  const { kickoffTs } = useSelector(stakingConstantsSelector);
  const currentStakes = useSelector(stakesDatesSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);
  const staking = useSelector(stakingContractSelector);

  const estimateExtendFee: StakingFeeEstimator = useCallback(
    async (_, unlockDate) => {
      if (!staking || !selectedStakeData) {
        throw new Error(selectorsErrors.missingData);
      }

      return staking.estimateGas.extendStakingDuration(
        selectedStakeData.unlockDate,
        unlockDate
      );
    },
    [selectedStakeData, staking]
  );

  const handleExtend = async ({ unlockDate }: ExtendStakeValues) => {
    if (!staking || !selectedStakeData) {
      throw new Error(selectorsErrors.missingData);
    }

    return staking.extendStakingDuration(
      selectedStakeData.unlockDate,
      unlockDate
    );
  };

  const { handleSubmit: onExtend, ...extendTxData } =
    useContractCall(handleExtend);

  if (!kickoffTs || !selectedStakeData) {
    return null;
  }

  return (
    <>
      <ExtendStakeComponent
        open={open}
        onClose={onClose}
        stakes={currentStakes}
        kickoffTs={kickoffTs}
        onExtend={onExtend}
        estimateExtendFee={estimateExtendFee}
        prevDate={selectedStakeData.unlockDate}
        stakedAmount={selectedStakeData.lockedAmount}
      />

      {extendTxData.status !== 'idle' && (
        <SubmitStatusDialog
          successCallback={onClose}
          operationName="Extending stake"
          {...extendTxData}
        />
      )}
    </>
  );
};
