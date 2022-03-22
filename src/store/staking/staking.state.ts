import { LoadableAmount, LoadableValue } from '../types';

export type StakeListItem = {
  asset: string;
  lockedAmount: string;
  // votingPower: string;
  votingDelegation: string;
  unlockDate: number;
};

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
  vestsList: LoadableValue<VestListItem[]> = {
    data: [],
    state: 'idle',
  };
  vestsAddressesList: LoadableValue<VestListAddress[]> = {
    data: [],
    state: 'idle',
  };
}
