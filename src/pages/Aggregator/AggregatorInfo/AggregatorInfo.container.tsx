import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TokenEnum } from '../../../config/tokens';
import {
  destinationTokenAggregatorBalanceSelector,
  destinationTokenAggregatorBalanceStateSelector,
  feesAndLimitsSelector,
  feesAndLimitsStateSelector,
  startingTokenDecimalsSelector,
} from '../../../store/aggregator/aggregator.selectors';
import { AggregatorInfoComponent } from './AggregatorInfo.component';
import { AggregatorInfoContainerProps } from './AggregatorInfo.types';

export const AggregatorInfoContainer = ({
  toggleFlow,
  startingToken,
  destinationToken,
}: AggregatorInfoContainerProps) => {
  const onClick = () => {
    toggleFlow();
  };

  const feesAndLimitsState = useSelector(feesAndLimitsStateSelector);
  const feesAndLimits = useSelector(feesAndLimitsSelector);
  const tokenDecimals = useSelector(startingTokenDecimalsSelector);
  const destinationTokenAggregatorBalance = useSelector(
    destinationTokenAggregatorBalanceSelector
  );
  const destinationTokenAggregatorBalanceState = useSelector(
    destinationTokenAggregatorBalanceStateSelector
  );

  const aggregatorBalance = useMemo(
    () =>
      startingToken === TokenEnum.XUSD &&
      destinationToken !== '' &&
      destinationTokenAggregatorBalance
        ? destinationTokenAggregatorBalance
        : undefined,
    [destinationToken, destinationTokenAggregatorBalance, startingToken]
  );

  return (
    <AggregatorInfoComponent
      onClick={onClick}
      feesAndLimitsState={feesAndLimitsState}
      feesAndLimits={feesAndLimits}
      startingToken={startingToken}
      destinationToken={destinationToken}
      tokenDecimals={tokenDecimals}
      aggregatorBalance={aggregatorBalance}
      aggregatorBalanceState={destinationTokenAggregatorBalanceState}
    />
  );
};
