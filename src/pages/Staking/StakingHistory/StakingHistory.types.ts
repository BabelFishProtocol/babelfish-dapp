export type StakingHistoryListItem = {
  asset: string;
  stakedAmount: string;
  stakingDate: string;
  totalStaked: string;
};

export type StakingHistoryComponentProps = {
  stakes: StakingHistoryListItem[];
};
