import { useCallback } from 'react';
import { constants, utils } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';

import {
  accountSelector,
  fishTokenSelector,
  stakingContractSelector,
} from '../../../store/app/app.selectors';

import {
  fishTokenDataSelector,
  stakingConstantsSelector,
  stakesDatesSelector,
  addStakeSubmitStatusSelector,
} from '../../../store/staking/staking.selectors';
import { ONE_DAY } from '../../../constants';

import { StakingFeeEstimator } from '../Staking.types';
import {
  AddNewStakeContainerProps,
  AddNewStakeFormValues,
} from './AddNewStake.types';
import { AddNewStakeComponent } from './AddNewStake.component';
import { stakingActions } from '../../../store/staking/staking.slice';
import { SubmitStatusDialog } from '../../../components/TxDialog/TxDialog.component';

export const AddNewStakeContainer = ({
  open,
  onClose,
}: AddNewStakeContainerProps) => {
  const dispatch = useDispatch();

  const currentStakes = useSelector(stakesDatesSelector);
  const account = useSelector(accountSelector);
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
    async (amount: string, timestamp: number) =>
      staking?.estimateGas.stake(
        utils.parseEther(amount),
        timestamp + ONE_DAY,
        constants.AddressZero,
        constants.AddressZero
      ),
    [staking?.estimateGas]
  );

  if (!kickoffTs || !staking || !account) {
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
        <SubmitStatusDialog
          successCallback={onClose}
          onClose={handleResetCallData}
          tx={submitTx.currentTx}
          status={submitTx.status}
          txReceipt={submitTx.currentTxReceipt}
          operationName={submitTx.currentStep || ''}
        />
      )}
    </>
  );
};
