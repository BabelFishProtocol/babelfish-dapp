import { VestListItem } from '../../../store/staking/staking.state';
import { FiniteStates } from '../../../utils/types';

export type VestsListComponentProps = {
  vests: VestListItem[];
  state: FiniteStates;
};
