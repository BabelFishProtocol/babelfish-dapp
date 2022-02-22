import { LoadableValue } from '../types';

export type StakeListItem = {
  asset: string;
  lockedAmount: string;
  votingPower: string;
  votingDelegation: string;
  stakingPeriod: string;
  unlockDate: number;
};

export type VestsListItem = StakeListItem & {
  stakingDate: string;
};

export type StakingData = { kickoffTs?: number };

export class StakingState {
  stakesList: LoadableValue<StakeListItem[]> = {
    data: [],
    state: 'idle',
  };

  vestsList: LoadableValue<VestsListItem[]> = {
    data: [],
    state: 'idle',
  };

  pageData: LoadableValue<StakingData> = {
    data: {
      kickoffTs: undefined,
    },
    state: 'idle',
  };

  selectedStake?: number;

  selectedVest?: number;
}
