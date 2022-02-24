import { LoadableAmount, LoadableValue } from '../types';

export type StakeListItem = {
  asset: string;
  lockedAmount: string;
  // votingPower: string;
  votingDelegation: string;
  unlockDate: number;
};

export type VestsListItem = StakeListItem & {
  stakingPeriodStart: number;
};

export type FishTokenInfo = {
  balance?: string;
  totalStaked?: string;
  allowanceForStaking?: string;
};

export class StakingState {
  selectedVest?: number;
  selectedStake?: number;

  kickoffTs: LoadableValue<number | undefined> = {
    state: 'idle',
    data: undefined,
  };
  combinedVotingPower: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
  fishToken: LoadableValue<FishTokenInfo> = {
    data: {
      balance: undefined,
      totalStaked: undefined,
      allowanceForStaking: undefined,
    },
    state: 'idle',
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
