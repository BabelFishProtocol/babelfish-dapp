export type StakeListItem = {
  asset: string;
  lockedAmount: string;
  votingPower: string;
  votingDelegation: string;
  stakingPeriod: string;
  unlockDate: string;
};

export type StakesListComponentProps = {
  stakes: StakeListItem[];
};
