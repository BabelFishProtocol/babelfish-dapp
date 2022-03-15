import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SubmitStatusDialog } from '../../../../components/TxDialog/TxDialog.component';
import { Vesting } from '../../../../contracts/types';
import { useContractCall } from '../../../../hooks/useContractCall';
import {
  accountSelector,
  providerSelector,
} from '../../../../store/app/app.selectors';

import {
  combinedVotingPowerSelector,
  selectedVestSelector,
} from '../../../../store/staking/staking.selectors';
import { getVesting } from '../../../../store/staking/staking.utils';
import { DelegateFeeEstimator } from '../../Staking.types';

import { DelegateVestComponent } from './DelegateVest.component';
import { DelegateVestValues } from './DelegateVest.fields';
import { DelegateVestContainerProps } from './DelegateVest.types';

export const DelegateVestContainer = ({
  open,
  onClose,
}: DelegateVestContainerProps) => {
  const account = useSelector(accountSelector);
  const selectedVestData = useSelector(selectedVestSelector);
  const combinedVotingPower = useSelector(combinedVotingPowerSelector);
  const provider = useSelector(providerSelector);
  const [vesting, setVesting] = useState<Vesting | undefined>();

  useEffect(() => {
    if (!provider || !selectedVestData) {
      throw new Error('missing data');
    }
    const vested = getVesting(selectedVestData.address, provider);

    setVesting(vested);
  }, [selectedVestData, provider]);

  const handleDelegate = ({ delegateTo }: DelegateVestValues) => {
    if (!vesting || !provider || !selectedVestData || !account) {
      throw new Error('missing data');
    }

    return vesting.delegate(delegateTo.toLowerCase(), { from: account });
  };

  const { handleSubmit: onDelegate, ...delegateTxData } =
    useContractCall(handleDelegate);

  const estimateFee: DelegateFeeEstimator = useCallback(
    (delegateTo) => {
      if (!vesting || !selectedVestData) {
        throw new Error('missing data');
      }

      return vesting.estimateGas.delegate(delegateTo);
    },
    [selectedVestData, vesting]
  );

  if (
    !selectedVestData ||
    !account ||
    !combinedVotingPower ||
    !combinedVotingPower.data
  ) {
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
        // setDelegate={setDelegate}
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
