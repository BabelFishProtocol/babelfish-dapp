import { FiniteStates } from '../../../utils/types';

export type StakingHistoryListItem = {
  asset: string;
  stakedAmount: string;
  stakingDate: number;
  totalStaked: string;
};

export type StakingHistoryComponentProps = {
  state: FiniteStates;
  stakes: StakingHistoryListItem[];
};
