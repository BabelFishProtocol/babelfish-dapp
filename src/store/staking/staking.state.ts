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
  fishBalance?: string;
  totalStaked?: string;
  allowanceForStaking?: string;
};

export type StakeConstants = {
  kickoffTs?: number;
  WEIGHT_FACTOR?: string;
};

export class StakingState {
  selectedVest?: number;
  selectedStake?: number;

  constants: LoadableValue<StakeConstants> = {
    state: 'idle',
    data: { WEIGHT_FACTOR: undefined, kickoffTs: undefined },
  };

  combinedVotingPower: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
  fishToken: LoadableValue<FishTokenInfo> = {
    data: {
      fishBalance: undefined,
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
