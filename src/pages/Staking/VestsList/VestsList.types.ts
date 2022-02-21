import { VestsListItem } from '../../../store/staking/staking.state';
import { FiniteStates } from '../../../utils/types';

export type VestsListComponentProps = {
  vests: VestsListItem[];
  state: FiniteStates;
};
