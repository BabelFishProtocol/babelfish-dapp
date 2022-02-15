import { StakeListItem } from '../../../store/staking/staking.state';
import { FiniteStates } from '../../../utils/types';

export type StakesListComponentProps = {
  stakes: StakeListItem[];
  state: FiniteStates;
};
