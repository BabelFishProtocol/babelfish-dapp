import { useSelector } from 'react-redux';
import {
  feesAndLimitsSelector,
  feesAndLimitsStateSelector,
  startingTokenDecimalsSelector,
  startingTokenNameSelector,
} from '../../../store/aggregator/aggregator.selectors';
import { AggregatorInfoComponent } from './AggregatorInfo.component';
import { AggregatorInfoContainerProps } from './AggregatorInfo.types';

export const AggregatorInfoContainer = ({
  toggleFlow,
}: AggregatorInfoContainerProps) => {
  const onClick = () => {
    toggleFlow();
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
