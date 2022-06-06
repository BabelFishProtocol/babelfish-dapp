import { FeesAndLimitsType } from '../../../store/aggregator/aggregator.state';
import { FiniteStates } from '../../../utils/types';

export type AggregatorInfoContainerProps = {
  toggleFlow: VoidFunction;
};

export type AggregatorInfoComponentProps = {
  onClick: () => void;
  state: FiniteStates;
  feesAndLimits: FeesAndLimitsType;
  tokenName?: string;
  tokenDecimals?: number;
};
