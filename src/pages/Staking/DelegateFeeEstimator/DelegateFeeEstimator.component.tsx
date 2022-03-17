import Typography from '@mui/material/Typography';
import { useWatch } from 'react-hook-form';
import { formatWeiAmount } from '../../../utils/helpers';
import {
  DelegateFields,
  FeeEstimatorProps,
} from './DelegateFeeEstimator.fields';
import { useEstimateDelegateFee } from './DelegateFeeEstimator.hooks';

export const FeeEstimator = ({ control, estimateFee }: FeeEstimatorProps) => {
  const watchDelegateTo = useWatch({
    control,
    name: DelegateFields.delegateTo,
  });

  const estimatedFee = useEstimateDelegateFee({
    delegateTo: watchDelegateTo,
    estimator: estimateFee,
  });

  return (
    <Typography>Tx Fee: {formatWeiAmount(estimatedFee, 7)} RBTC</Typography>
  );
};
