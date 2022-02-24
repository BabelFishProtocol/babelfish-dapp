import { LoadableAmount, LoadableValue } from '../types';

export type StakeListItem = {
  asset: string;
  lockedAmount: string;
  votingPower: string;
  votingDelegation: string;
  unlockDate: number;
};

export type VestsListItem = StakeListItem & {
  stakingPeriodStart: number;
};

export class StakingState {
  selectedVest?: number;
  selectedStake?: number;

  kickoffTs: LoadableValue<number | undefined> = {
    state: 'idle',
    data: undefined,
  };
  totalStaked: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
  combinedVotingPower: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };

  stakesList: LoadableValue<StakeListItem[]> = {
    data: [],
    state: 'idle',
  };
  vestsList: LoadableValue<VestsListItem[]> = {
    data: [],
    state: 'idle',
  };
}
