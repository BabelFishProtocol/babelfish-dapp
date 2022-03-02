import { useEffect, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import { useSelector } from 'react-redux';
import { FieldPath, FieldValues, UseFormWatch } from 'react-hook-form';

import {
  fishTokenDataSelector,
  stakingConstantsSelector,
} from '../../store/staking/staking.selectors';
import { useDebounce } from '../../hooks/useDebounce';
import { getCurrentTimestamp } from '../../utils/helpers';
import {
  providerSelector,
  stakingContractSelector,
} from '../../store/app/app.selectors';
import { UseEstimateFeeConfig } from './Staking.types';

export const useStakeModalForm = (
  selectStake: () => void,
  clearSelectedStake: () => void
) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowForm = () => {
    selectStake();
    setShowModal(true);
  };
  const handleCloseForm = () => {
    clearSelectedStake();
    setShowModal(false);
  };

  return [showModal, handleShowForm, handleCloseForm] as const;
};

export const useNeedApproval = <FormValues extends FieldValues>(
  watch: UseFormWatch<FormValues>,
  amountField: FieldPath<FormValues>
) => {
  const { allowanceForStaking } = useSelector(fishTokenDataSelector);
  const watchCurrentValue = watch(amountField);

  const needsApproval = useMemo(() => {
    if (watchCurrentValue === '') {
      return false;
    }

    return utils
      .parseEther(watchCurrentValue)
      .gt(BigNumber.from(allowanceForStaking));
  }, [watchCurrentValue, allowanceForStaking]);

  return needsApproval;
};

export const useVotingPower = (amount: string, unlockDate: number) => {
  const [votingPower, setVotingPower] = useState('0');
  const staking = useSelector(stakingContractSelector);
  const { WEIGHT_FACTOR } = useSelector(stakingConstantsSelector);

  const debouncedAmount = useDebounce(amount);
  const debouncedUnlockDate = useDebounce(unlockDate);

  useEffect(() => {
    const calculateVotingPower = async () => {
      if (
        !staking ||
        !WEIGHT_FACTOR ||
        !debouncedUnlockDate ||
        debouncedAmount === ''
      ) {
        setVotingPower('0');
        return;
      }

      const currentTimestamp = getCurrentTimestamp();
      const weight = await staking.computeWeightByDate(
        debouncedUnlockDate,
        currentTimestamp
      );

      const power = utils
        .parseEther(debouncedAmount)
        .mul(weight)
        .div(WEIGHT_FACTOR);

      setVotingPower(power.toString());
    };

    calculateVotingPower();
  }, [WEIGHT_FACTOR, staking, debouncedUnlockDate, debouncedAmount]);

  return votingPower;
};

export const useEstimateFee = ({
  amount,
  timestamp,
  estimator,
}: UseEstimateFeeConfig) => {
  const provider = useSelector(providerSelector);
  const [estimatedFee, setEstimatedFee] = useState('0');

  const debouncedAmount = useDebounce(amount);
  const debouncedTimestamp = useDebounce(timestamp);

  useEffect(() => {
    const estimate = async () => {
      if (!debouncedTimestamp || debouncedAmount === '' || !provider) {
        setEstimatedFee('0');
        return;
      }

      const estimatedValue = await estimator(
        debouncedAmount,
        debouncedTimestamp
      );
      const gasPrice = await provider.getGasPrice();

      if (estimatedValue) {
        setEstimatedFee(estimatedValue.mul(gasPrice).toString());
      }
    };

    estimate();
  }, [debouncedAmount, estimator, provider, debouncedTimestamp]);

  return estimatedFee;
};
