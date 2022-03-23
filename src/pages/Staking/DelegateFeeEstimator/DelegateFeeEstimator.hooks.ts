import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../../hooks/useDebounce';
import { providerSelector } from '../../../store/app/app.selectors';
import { isRskAddress } from '../../../utils/helpers';
import { calculateFee } from '../Staking.hooks';
import { UseEstimateDelegateFeeConfig } from './DelegateFeeEstimator.fields';

export const useEstimateDelegateFee = ({
  to,
  estimator,
}: UseEstimateDelegateFeeConfig) => {
  const provider = useSelector(providerSelector);
  const [estimatedFee, setEstimatedFee] = useState('0');

  const debouncedDelegate = useDebounce(to);

  useEffect(() => {
    const estimate = async () => {
      if (!isRskAddress(debouncedDelegate) || !provider) {
        setEstimatedFee('0');
        return;
      }

      const estimatedGas = await estimator(debouncedDelegate);

      if (estimatedGas) {
        const fee = await calculateFee(provider, estimatedGas);
        setEstimatedFee(fee);
      }
    };

    estimate();
  }, [estimator, provider, debouncedDelegate]);

  return estimatedFee;
};
