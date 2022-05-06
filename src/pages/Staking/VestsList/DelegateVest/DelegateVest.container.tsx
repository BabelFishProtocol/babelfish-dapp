import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  delegateVestStatusSelector,
  selectedVestContractSelector,
  selectedVestSelector,
} from '../../../../store/vesting/vesting.selectors';
import { selectorsErrors } from '../../../../constants';
import { vestingActions } from '../../../../store/vesting/vesting.slice';
import { combinedVotingPowerSelector } from '../../../../store/staking/staking.selectors';
import { SubmitStepsDialog } from '../../../../components/TxDialog/TxDialog.component';

import { FeeEstimator } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';
import { DelegateVestValues } from './DelegateVest.fields';
import { DelegateVestComponent } from './DelegateVest.component';
import { DelegateVestContainerProps } from './DelegateVest.types';

export const DelegateVestContainer = ({
  open,
  onClose,
}: DelegateVestContainerProps) => {
  const dispatch = useDispatch();
  const selectedVestData = useSelector(selectedVestSelector);
  const combinedVotingPower = useSelector(combinedVotingPowerSelector);
  const vesting = useSelector(selectedVestContractSelector);
  const submitTx = useSelector(delegateVestStatusSelector);

  const estimateFee: FeeEstimator = useCallback(
    (delegateTo) => {
      if (!vesting) {
        throw new Error(selectorsErrors.missingData);
      }

      return vesting.estimateGas.delegate(delegateTo);
    },
    [vesting]
  );

  if (!selectedVestData || !combinedVotingPower.data) {
    return null;
  }

  const handleDelegate = (formValues: DelegateVestValues) => {
    dispatch(vestingActions.delegateVest(formValues));
  };

  const handleReset = () => {
    dispatch(vestingActions.resetDelegateVest());
  };

  return (
    <>
      <DelegateVestComponent
        open={open}
        onClose={onClose}
        votingPower={combinedVotingPower.data}
        currentDelegate={selectedVestData.votingDelegation}
        onDelegate={handleDelegate}
        estimateFee={estimateFee}
      />
      {submitTx.status !== 'idle' && (
        <SubmitStepsDialog
          successCallback={onClose}
          onClose={handleReset}
          steps={submitTx.steps}
          status={submitTx.status}
          summary={submitTx.summary}
          currentStep={submitTx.currentStep}
        />
      )}
    </>
  );
};
