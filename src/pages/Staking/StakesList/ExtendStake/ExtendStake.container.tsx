import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  stakesDatesSelector,
  selectedStakeSelector,
  stakingConstantsSelector,
  extendStakeStatusSelector,
} from '../../../../store/staking/staking.selectors';
import { stakingActions } from '../../../../store/staking/staking.slice';
import { stakingContractSelector } from '../../../../store/app/app.selectors';

import { StakingFeeEstimator } from '../../Staking.types';

import { selectorsErrors } from '../../../../constants';
import { SubmitStepsDialog } from '../../../../components/TxDialog/TxDialog.component';

import { ExtendStakeValues } from './ExtendStake.fields';
import { ExtendStakeComponent } from './ExtendStake.component';
import { ExtendStakeContainerProps } from './ExtendStake.types';

export const ExtendStakeContainer = ({
  open,
  onClose,
}: ExtendStakeContainerProps) => {
  const dispatch = useDispatch();
  const { kickoffTs } = useSelector(stakingConstantsSelector);
  const currentStakes = useSelector(stakesDatesSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);
  const staking = useSelector(stakingContractSelector);
  const submitTx = useSelector(extendStakeStatusSelector);

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

  const handleExtend = (formValues: ExtendStakeValues) => {
    dispatch(stakingActions.extendStake(formValues));
  };

  const handleResetCallData = () => {
    dispatch(stakingActions.resetExtend());
  };

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
        onExtend={handleExtend}
        estimateExtendFee={estimateExtendFee}
        prevDate={selectedStakeData.unlockDate}
        stakedAmount={selectedStakeData.lockedAmount}
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
