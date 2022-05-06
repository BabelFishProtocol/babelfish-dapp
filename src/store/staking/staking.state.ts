import { StakingHistoryListItem } from '../../pages/Staking/StakingHistory/StakingHistory.types';
import { CallState, LoadableAmount, LoadableValue } from '../types';

export type AddNewStakeCalls = 'stake' | 'approve';
export type IncreaseCalls = 'stake' | 'approve';
export type ExtendCalls = 'extend';
export type WithdrawCalls = 'withdraw';
export type DelegateCalls = 'delegate';

export type StakeListItem = {
  asset: string;
  lockedAmount: string;
  // votingPower: string;
  votingDelegation: string;
  unlockDate: number;
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
  selectedStake?: StakeListItem;

  addNewStakeCall: CallState<AddNewStakeCalls> = {
    status: 'idle',
    steps: [
      { name: 'approve', label: 'approving' },
      { name: 'stake', label: 'staking' },
    ],
  };

  increaseCall: CallState<IncreaseCalls> = {
    status: 'idle',
    steps: [
      { name: 'approve', label: 'approving' },
      { name: 'stake', label: 'staking' },
    ],
  };

  extendCall: CallState<ExtendCalls> = {
    status: 'idle',
    steps: [{ name: 'extend', label: 'extending' }],
  };

  delegateCall: CallState<DelegateCalls> = {
    status: 'idle',
    steps: [{ name: 'delegate', label: 'delegating' }],
  };

  withdrawCall: CallState<WithdrawCalls> = {
    status: 'idle',
    steps: [{ name: 'withdraw', label: 'Unstaking FISH' }],
  };

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
  stakesListHistory: LoadableValue<StakingHistoryListItem[]> = {
    data: [],
    state: 'idle',
  };
}
