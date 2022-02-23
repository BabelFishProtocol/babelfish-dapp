import { LoadableAmount } from '../../store/types';

export type RewardBlockProps = {
  amount: string;
  asset: string;
  usdAmount: string;
};

export type StakingComponentProps = Record<
  'fishStaked' | 'totalRewards' | 'votingPower',
  LoadableAmount
> & {
  rewards: RewardBlockProps[];
};
