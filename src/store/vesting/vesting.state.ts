import { StakeListItem } from '../staking/staking.state';
import { CallState, LoadableValue } from '../types';

export type DelegateVestCalls = 'delegate';

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
  delegateCall: CallState<DelegateVestCalls> = {
    status: 'idle',
    steps: [{ name: 'delegate', label: 'Delegating vest' }],
  };

  selectedVest?: VestListItem;

  vestsList: LoadableValue<VestListItem[]> = {
    data: [],
    state: 'idle',
  };
}
