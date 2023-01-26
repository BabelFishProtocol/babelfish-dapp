import { useSelector } from 'react-redux';
import {
  incentivesSelector,
  incentivesStateSelector,
  feesAndLimitsSelector,
  feesAndLimitsStateSelector,
  startingTokenDecimalsSelector,
  startingTokenNameSelector,
  sendAmountSelector,
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
  const incentivesState = useSelector(incentivesStateSelector);
  const incentives = useSelector(incentivesSelector);
  const sendAmount = useSelector(sendAmountSelector);

  return (
    <AggregatorInfoComponent
      onClick={onClick}
      feesAndLimitsState={feesAndLimitsState}
      feesAndLimits={feesAndLimits}
      tokenName={tokenName}
      tokenDecimals={tokenDecimals}
      incentivesState={incentivesState}
      incentives={incentives}
      sendAmount={sendAmount}
    />
  );
};
