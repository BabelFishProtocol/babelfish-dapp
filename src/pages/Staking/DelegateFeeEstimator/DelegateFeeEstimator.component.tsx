import Typography from '@mui/material/Typography';
import { useWatch } from 'react-hook-form';
import { formatWeiAmount } from '../../../utils/helpers';
import { FeeEstimatorProps } from './DelegateFeeEstimator.fields';
import { useEstimateDelegateFee } from './DelegateFeeEstimator.hooks';

export function FeeEstimator<FormValues>({
  name,
  control,
  estimateFee,
}: FeeEstimatorProps<FormValues>) {
  const watchTo = useWatch({
    control,
    name,
  });

  const estimatedFee = useEstimateDelegateFee({
    to: watchTo as string,
    estimator: estimateFee,
  });

  return (
    <Typography>Tx Fee: {formatWeiAmount(estimatedFee, 7)} RBTC</Typography>
  );
}
