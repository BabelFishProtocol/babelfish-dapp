import { TokenEnum } from '../../../config/tokens';
import {
  FeesAndLimitsType,
  IncentivesType,
} from '../../../store/aggregator/aggregator.state';
import { FiniteStates } from '../../../utils/types';

export type AggregatorInfoContainerProps = {
  toggleFlow: VoidFunction;
  startingToken: TokenEnum | '';
  destinationToken: TokenEnum | '';
};

export type AggregatorInfoComponentProps = {
  onClick: () => void;
  feesAndLimitsState: FiniteStates;
  feesAndLimits: FeesAndLimitsType;
  startingToken?: string;
  destinationToken?: string;
  tokenDecimals?: number;
  aggregatorBalance?: string;
  aggregatorBalanceState: FiniteStates;
  incentivesState?: FiniteStates;
  incentives?: IncentivesType;
  sendAmount?: string;
};
