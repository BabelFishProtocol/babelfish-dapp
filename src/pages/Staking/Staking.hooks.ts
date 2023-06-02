import { useEffect, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import { useSelector } from 'react-redux';
import { FieldPath, FieldValues, UseFormWatch } from 'react-hook-form';

import { Web3Provider } from '@ethersproject/providers';
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
      const currentTimestamp = getCurrentTimestamp();

      if (
        !staking ||
        !WEIGHT_FACTOR ||
        !debouncedUnlockDate ||
        debouncedAmount === '' ||
        currentTimestamp > debouncedUnlockDate
      ) {
        setVotingPower('0');
        return;
      }

      const timestampToLockDate = await staking.timestampToLockDate(
        currentTimestamp
      );

      const weight = await staking.computeWeightByDate(
        debouncedUnlockDate,
        timestampToLockDate
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

export const calculateFee = async (
  provider: Web3Provider,
  estimated: BigNumber
) => {
  const gasPrice = await provider.getGasPrice();

  return estimated.mul(gasPrice).toString();
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

      const estimatedGas = await estimator(debouncedAmount, debouncedTimestamp);

      if (estimatedGas) {
        const fee = await calculateFee(provider, estimatedGas);
        setEstimatedFee(fee);
      }
    };

    estimate();
  }, [debouncedAmount, estimator, provider, debouncedTimestamp]);

  return estimatedFee;
};

export const useIsInMaintenance = () => {
  const [isInMaintenance, setIsInMaintenance] = useState(false);

  const staking = useSelector(stakingContractSelector);

  useEffect(() => {
    const fetchIsPaused = async () => {
      const isPaused = await staking?.paused();

      setIsInMaintenance(isPaused || false);
    };
    fetchIsPaused();
  }, [staking]);

  return isInMaintenance;
};
