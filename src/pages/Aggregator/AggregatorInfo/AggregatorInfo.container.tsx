import { useSelector } from 'react-redux';
import {
  depositRewardSelector,
  feesAndLimitsSelector,
  feesAndLimitsStateSelector,
  startingTokenDecimalsSelector,
  startingTokenNameSelector,
  withdrawalPenaltySelector,
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
  const depositReward = useSelector(depositRewardSelector);
  const withdrawalPenalty = useSelector(withdrawalPenaltySelector);

  return (
    <AggregatorInfoComponent
      onClick={onClick}
      state={feesAndLimitsState}
      feesAndLimits={feesAndLimits}
      tokenName={tokenName}
      tokenDecimals={tokenDecimals}
      depositReward={depositReward}
      withdrawalPenalty={withdrawalPenalty}
    />
  );
};
