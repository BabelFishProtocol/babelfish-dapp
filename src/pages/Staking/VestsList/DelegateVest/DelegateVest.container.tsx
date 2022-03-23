import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SubmitStatusDialog } from '../../../../components/TxDialog/TxDialog.component';
import { useContractCall } from '../../../../hooks/useContractCall';
import {
  accountSelector,
  providerSelector,
} from '../../../../store/app/app.selectors';

import { combinedVotingPowerSelector } from '../../../../store/staking/staking.selectors';

import { DelegateVestComponent } from './DelegateVest.component';
import { FeeEstimator } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';
import { DelegateVestContainerProps } from './DelegateVest.types';
import { DelegateVestValues } from './DelegateVest.fields';
import { selectorsErrors } from '../../../../constants';
import {
  selectedVestContractSelector,
  selectedVestSelector,
} from '../../../../store/vesting/vesting.selectors';

export const DelegateVestContainer = ({
  open,
  onClose,
}: DelegateVestContainerProps) => {
  const account = useSelector(accountSelector);
  const selectedVestData = useSelector(selectedVestSelector);
  const combinedVotingPower = useSelector(combinedVotingPowerSelector);
  const provider = useSelector(providerSelector);
  const vesting = useSelector(selectedVestContractSelector);

  const handleDelegate = ({ delegateTo }: DelegateVestValues) => {
    if (!vesting || !provider || !selectedVestData || !account) {
      throw new Error(selectorsErrors.missingData);
    }

    return vesting.delegate(delegateTo.toLowerCase(), { from: account });
  };

  const { handleSubmit: onDelegate, ...delegateTxData } =
    useContractCall(handleDelegate);

  const estimateFee: FeeEstimator = useCallback(
    (delegateTo) => {
      if (!vesting || !selectedVestData) {
        throw new Error(selectorsErrors.missingData);
      }

      return vesting.estimateGas.delegate(delegateTo);
    },
    [selectedVestData, vesting]
  );

  if (!selectedVestData || !account || !combinedVotingPower.data) {
    return null;
  }

  return (
    <>
      <DelegateVestComponent
        open={open}
        onClose={onClose}
        votingPower={combinedVotingPower.data}
        currentDelegate={selectedVestData.votingDelegation}
        onDelegate={onDelegate}
        estimateFee={estimateFee}
      />
      {delegateTxData.status !== 'idle' && (
        <SubmitStatusDialog
          successCallback={onClose}
          operationName="Delegating vest"
          {...delegateTxData}
        />
      )}
    </>
  );
};
