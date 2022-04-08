import { FiniteStates } from '../../../utils/types';

export type StakingHistoryListItem = {
  asset: string;
  stakedAmount: string;
  unlockDate: string;
  txHash: string;
  totalStaked: string;
};

export type StakingHistoryComponentProps = {
  state: FiniteStates;
  stakes: StakingHistoryListItem[];
};
