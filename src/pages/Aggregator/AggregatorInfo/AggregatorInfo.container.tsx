import { useDispatch, useSelector } from 'react-redux';
import {
  feesAndLimitsSelector,
  feesAndLimitsStateSelector,
  startingTokenDecimalsSelector,
  startingTokenNameSelector,
} from '../../../store/aggregator/aggregator.selectors';
import { aggregatorActions } from '../../../store/aggregator/aggregator.slice';
import { AggregatorInfoComponent } from './AggregatorInfo.component';

export const AggregatorInfoContainer = () => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(aggregatorActions.toggleFlowState());
  };

  const feesAndLimitsState = useSelector(feesAndLimitsStateSelector);
  const feesAndLimits = useSelector(feesAndLimitsSelector);
  const tokenName = useSelector(startingTokenNameSelector);
  const tokenDecimals = useSelector(startingTokenDecimalsSelector);

  return (
    <AggregatorInfoComponent
      onClick={onClick}
      state={feesAndLimitsState}
      feesAndLimits={feesAndLimits}
      tokenName={tokenName}
      tokenDecimals={tokenDecimals}
    />
  );
};
