import { StakeListItem } from '../staking/staking.state';
import { LoadableValue } from '../types';

export type VestListItem = StakeListItem & {
  stakingPeriodStart: number;
  address: string;
  addressType: VestListAddress['type'];
  cliff: number;
};

export type VestListAddress = {
  address: string;
  type: 'genesis' | 'team';
};

export class VestingState {
  selectedVest?: VestListItem;

  vestsList: LoadableValue<VestListItem[]> = {
    data: [],
    state: 'idle',
  };
}
