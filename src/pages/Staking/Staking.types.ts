import { BigNumber } from 'ethers';
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

export type StakingFeeEstimator = (
  amount: string,
  timestamp: number
) => Promise<BigNumber | undefined>;

export type UseEstimateFeeConfig = {
  amount: string;
  estimator: StakingFeeEstimator;
  timestamp?: number;
};

export type DelegateFeeEstimator = (
  delegateTo: string
) => Promise<BigNumber | undefined>;

export type UseEstimateDelegateFeeConfig = {
  delegateTo: string;
  estimator: DelegateFeeEstimator;
};
