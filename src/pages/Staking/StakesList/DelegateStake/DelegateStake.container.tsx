import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  accountSelector,
  stakingContractSelector,
} from '../../../../store/app/app.selectors';
import {
  delegateStatusSelector,
  selectedStakeSelector,
} from '../../../../store/staking/staking.selectors';
import { stakingActions } from '../../../../store/staking/staking.slice';

import { SubmitStepsDialog } from '../../../../components/TxDialog/TxDialog.component';
import { selectorsErrors } from '../../../../constants';

import {
  DelegateFeeEstimator,
  DelegateStakeContainerProps,
} from './DelegateStake.types';
import { DelegateStakeValues } from './DelegateStake.fields';
import { DelegateStakeComponent } from './DelegateStake.component';

export const DelegateStakeContainer = ({
  open,
  onClose,
}: DelegateStakeContainerProps) => {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);
  const staking = useSelector(stakingContractSelector);
  const submitTx = useSelector(delegateStatusSelector);

  const estimateFee: DelegateFeeEstimator = useCallback(
    (delegateTo) => {
      if (!staking || !selectedStakeData) {
        throw new Error(selectorsErrors.missingData);
      }

      return staking.estimateGas.delegate(
        delegateTo,
        selectedStakeData.unlockDate
      );
    },
    [selectedStakeData, staking]
  );

  if (!selectedStakeData || !account || !staking) {
    return null;
  }

  const handleDelegate = (values: DelegateStakeValues) => {
    dispatch(stakingActions.delegateStake(values));
  };

  const handleCancelDelegation = () => {
    dispatch(stakingActions.delegateStake({ delegateTo: account }));
  };

  const handleResetCallData = () => {
    dispatch(stakingActions.resetDelegate());
  };

  return (
    <>
      <DelegateStakeComponent
        open={open}
        onClose={onClose}
        account={account}
        onDelegate={handleDelegate}
        estimateFee={estimateFee}
        onCancelDelegation={handleCancelDelegation}
        currentDelegate={selectedStakeData.votingDelegation}
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
