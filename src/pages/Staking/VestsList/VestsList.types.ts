import { VestListItem } from '../../../store/vesting/vesting.state';
import { FiniteStates } from '../../../utils/types';

export type VestsListComponentProps = {
  vests: VestListItem[];
  state: FiniteStates;
};
