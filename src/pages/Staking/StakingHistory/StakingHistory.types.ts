export type StakingHistoryListItem = {
  asset: string;
  stakedAmount: string;
  stakingDate: number;
  totalStaked: string;
};

export type StakingHistoryComponentProps = {
  stakes: StakingHistoryListItem[];
};
