import { useDispatch, useSelector } from 'react-redux';
import { feesAndLimitsSelector } from '../../../store/aggregator/aggregator.selectors';
import { aggregatorActions } from '../../../store/aggregator/aggregator.slice';
import { AggregatorInfoComponent } from './AggregatorInfo.component';

export const AggregatorInfoContainer = () => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(aggregatorActions.toggleFlowState());
  };

  const feesAndLimits = useSelector(feesAndLimitsSelector);

  return (
    <AggregatorInfoComponent onClick={onClick} feesAndLimits={feesAndLimits} />
  );
};
