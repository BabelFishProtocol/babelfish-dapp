import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  accountSelector,
  stakingContractSelector,
} from '../../../../store/app/app.selectors';
import { selectedStakeSelector } from '../../../../store/staking/staking.selectors';
import { useContractCall } from '../../../../hooks/useContractCall';

import { SubmitStatusDialog } from '../../../../components/TxDialog/TxDialog.component';

import { DelegateStakeComponent } from './DelegateStake.component';
import {
  DelegateFeeEstimator,
  DelegateStakeContainerProps,
} from './DelegateStake.types';
import { DelegateStakeValues } from './DelegateStake.fields';

export const DelegateStakeContainer = ({
  open,
  onClose,
}: DelegateStakeContainerProps) => {
  const account = useSelector(accountSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);
  const staking = useSelector(stakingContractSelector);

  const handleDelegate = ({ delegateTo }: DelegateStakeValues) => {
    if (!staking || !selectedStakeData) {
      throw new Error('missing data');
    }

    return staking.delegate(
      delegateTo.toLowerCase(),
      selectedStakeData.unlockDate
    );
  };

  const { handleSubmit: onDelegate, ...delegateTxData } =
    useContractCall(handleDelegate);

  const handleCancelDelegation = () => {
    if (!staking || !selectedStakeData || !account) {
      throw new Error('missing data');
    }

    return staking.delegate(
      account.toLowerCase(),
      selectedStakeData.unlockDate
    );
  };

  const { handleSubmit: onCancelDelegation, ...cancelDelegationTxData } =
    useContractCall(handleCancelDelegation);

  const estimateFee: DelegateFeeEstimator = useCallback(
    (delegateTo) => {
      if (!staking || !selectedStakeData) {
        throw new Error('missing data');
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

  return (
    <>
      <DelegateStakeComponent
        open={open}
        onClose={onClose}
        account={account}
        onDelegate={onDelegate}
        estimateFee={estimateFee}
        onCancelDelegation={onCancelDelegation}
        currentDelegate={selectedStakeData.votingDelegation}
      />

      {delegateTxData.status !== 'idle' && (
        <SubmitStatusDialog
          successCallback={onClose}
          operationName="Delegating stake"
          {...delegateTxData}
        />
      )}

      {cancelDelegationTxData.status !== 'idle' && (
        <SubmitStatusDialog
          successCallback={onClose}
          operationName="Canceling delegation"
          {...cancelDelegationTxData}
        />
      )}
    </>
  );
};
