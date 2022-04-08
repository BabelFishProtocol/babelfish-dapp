import { TransactionReceipt } from '@ethersproject/providers';
import { ContractTransaction } from 'ethers';
import { FiniteStates } from '../../utils/types';
import { StakingHistoryListItem } from '../../pages/Staking/StakingHistory/StakingHistory.types';
import { LoadableAmount, LoadableValue } from '../types';

export type CallState<Operations extends string> = {
  status: FiniteStates;
  currentOperation?: Operations;
  tx?: ContractTransaction;
  txReceipt?: TransactionReceipt;
  error?: string;
};

export type AddNewStakeCalls = 'stake' | 'approve';

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
  selectedStake?: number;

  addNewStakeCall: CallState<AddNewStakeCalls> = {
    status: 'idle',
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
