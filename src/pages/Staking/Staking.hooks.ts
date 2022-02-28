import { useEffect, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import { useSelector } from 'react-redux';
import { FieldPath, FieldValues, UseFormWatch } from 'react-hook-form';

import {
  fishTokenDataSelector,
  stakingConstantsSelector,
} from '../../store/staking/staking.selectors';
import { getCurrentTimestamp } from '../../utils/helpers';
import {
  providerSelector,
  stakingContractSelector,
} from '../../store/app/app.selectors';

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

  // TODO: debounce
  useEffect(() => {
    const calculateVotingPower = async () => {
      if (!staking || !WEIGHT_FACTOR || !unlockDate || amount === '') {
        setVotingPower('0');
        return;
      }

      const currentTimestamp = getCurrentTimestamp();
      const weight = await staking.computeWeightByDate(
        unlockDate,
        currentTimestamp
      );

      const power = utils.parseEther(amount).mul(weight).div(WEIGHT_FACTOR);

      setVotingPower(power.toString());
    };

    calculateVotingPower();
  }, [WEIGHT_FACTOR, staking, unlockDate, amount]);

  return votingPower;
};

export type StakingFeeEstimator = (
  amount: string,
  timestamp: number
) => Promise<BigNumber | undefined>;

type UseEstimateFeeConfig<FormValues extends FieldValues> = {
  watch: UseFormWatch<FormValues>;
  amountField: FieldPath<FormValues>;
  estimator: StakingFeeEstimator;
  timestamp?: number;
};

export const useEstimateFee = <FormValues extends FieldValues>({
  watch,
  timestamp,
  estimator,
  amountField,
}: UseEstimateFeeConfig<FormValues>) => {
  const provider = useSelector(providerSelector);
  const [estimatedFee, setEstimatedFee] = useState('0');
  const watchCurrentValue = watch(amountField);

  // TODO: debounce
  useEffect(() => {
    const estimate = async () => {
      if (!timestamp || watchCurrentValue === '' || !provider) {
        setEstimatedFee('0');
        return;
      }

      const estimatedValue = await estimator(watchCurrentValue, timestamp);
      const gasPrice = await provider.getGasPrice();

      if (estimatedValue) {
        setEstimatedFee(estimatedValue.mul(gasPrice).toString());
      }
    };

    estimate();
  }, [estimator, provider, timestamp, watchCurrentValue]);

  console.log({ estimatedFee });

  return estimatedFee;
};
