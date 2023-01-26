import { FeesAndLimitsType, IncentivesType } from '../../../store/aggregator/aggregator.state';
import { FiniteStates } from '../../../utils/types';

export type AggregatorInfoContainerProps = {
  toggleFlow: VoidFunction;
};

export type AggregatorInfoComponentProps = {
  onClick: () => void;
  feesAndLimitsState: FiniteStates;
  feesAndLimits: FeesAndLimitsType;
  tokenName?: string;
  tokenDecimals?: number;
  incentivesState?: FiniteStates;
  incentives?: IncentivesType;
  sendAmount?: string;
};

