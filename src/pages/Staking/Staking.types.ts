import { LoadableAmount } from '../../utils/types';

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
