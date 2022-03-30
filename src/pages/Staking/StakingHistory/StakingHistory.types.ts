export type StakingHistoryListItem = {
  asset: string;
  stakedAmount: string;
  unlockDate: string;
  txHash: string;
  totalStaked: string;
};

export type StakingHistoryComponentProps = {
  stakes: StakingHistoryListItem[];
};
