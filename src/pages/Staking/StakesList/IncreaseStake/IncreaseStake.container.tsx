import { useCallback } from 'react';
import { BigNumber, utils } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import {
  fishTokenSelector,
  stakingContractSelector,
} from '../../../../store/app/app.selectors';
import {
  selectedStakeSelector,
  fishTokenDataSelector,
  increaseStakeStatusSelector,
} from '../../../../store/staking/staking.selectors';
import { stakingActions } from '../../../../store/staking/staking.slice';
import { StakingFeeEstimator } from '../../Staking.types';

import { SubmitStepsDialog } from '../../../../components/TxDialog/TxDialog.component';

import {
  IncreaseStakeContainerProps,
  IncreaseStakeFormValues,
} from './IncreaseStake.types';
import { IncreaseStakeComponent } from './IncreaseStake.component';
import { selectorsErrors } from '../../../../constants';

export const IncreaseStakeContainer = ({
  open,
  onClose,
}: IncreaseStakeContainerProps) => {
  const dispatch = useDispatch();

  const { fishBalance } = useSelector(fishTokenDataSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);
  const staking = useSelector(stakingContractSelector);
  const fishToken = useSelector(fishTokenSelector);
  const submitTx = useSelector(increaseStakeStatusSelector);

  const estimateApproveFee: StakingFeeEstimator = useCallback(
    async (amount: string, _: number) => {
      if (!fishToken || !staking) {
        throw new Error(selectorsErrors.missingData);
      }

      return fishToken.estimateGas.approve(
        staking.address,
        utils.parseEther(amount)
      );
    },
    [fishToken, staking]
  );

  const estimateStakeFee: StakingFeeEstimator = useCallback(
    /** We're not able to call the estimate stake when user doesn't have allowance, the number below is an average gas used in transactions */
    async () => BigNumber.from(200000),
    []
  );

  if (!selectedStakeData) {
    return null;
  }

  const handleIncrease = (formValues: IncreaseStakeFormValues) => {
    dispatch(stakingActions.increaseStake(formValues));
  };

  const handleResetCallData = () => {
    dispatch(stakingActions.resetIncrease());
  };

  return (
    <>
      <IncreaseStakeComponent
        open={open}
        onClose={onClose}
        handleIncrease={handleIncrease}
        fishBalance={fishBalance}
        estimateStakeFee={estimateStakeFee}
        estimateApproveFee={estimateApproveFee}
        unlockDate={selectedStakeData.unlockDate}
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
