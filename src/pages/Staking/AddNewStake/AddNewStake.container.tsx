import { useCallback } from 'react';
import { BigNumber, utils } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';

import {
  fishTokenSelector,
  stakingContractSelector,
} from '../../../store/app/app.selectors';
import {
  fishTokenDataSelector,
  stakingConstantsSelector,
  stakesDatesSelector,
  addStakeSubmitStatusSelector,
} from '../../../store/staking/staking.selectors';
import { stakingActions } from '../../../store/staking/staking.slice';

import { SubmitStepsDialog } from '../../../components/TxDialog/TxDialog.component';

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
  const dispatch = useDispatch();

  const currentStakes = useSelector(stakesDatesSelector);
  const staking = useSelector(stakingContractSelector);
  const fishToken = useSelector(fishTokenSelector);
  const { kickoffTs } = useSelector(stakingConstantsSelector);
  const { fishBalance } = useSelector(fishTokenDataSelector);
  const submitTx = useSelector(addStakeSubmitStatusSelector);

  // ----- approving -----

  const estimateApproveFee: StakingFeeEstimator = useCallback(
    async (amount: string, _: number) =>
      fishToken?.estimateGas.approve(
        staking?.address as string,
        utils.parseEther(amount)
      ),
    [fishToken?.estimateGas, staking?.address]
  );

  const estimateStakeFee: StakingFeeEstimator = useCallback(
    /** We're not able to call the estimate stake when user doesn't have allowance, the number below is an average gas used in transactions */
    async () => BigNumber.from(200000),
    []
  );

  if (!kickoffTs || !staking) {
    return null;
  }

  const handleStake = (values: AddNewStakeFormValues) => {
    dispatch(stakingActions.addNewStake(values));
  };

  const handleResetCallData = () => {
    dispatch(stakingActions.resetAddNewStake());
  };

  return (
    <>
      <AddNewStakeComponent
        open={open}
        onClose={onClose}
        onStake={handleStake}
        kickoffTs={kickoffTs}
        stakes={currentStakes}
        fishBalance={fishBalance}
        estimateStakeFee={estimateStakeFee}
        estimateApproveFee={estimateApproveFee}
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
