import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WalletConnectionChecker } from '../../components/WalletConnectionChecker/WalletConnectionChecker.component';

import { initStakePageThunk } from '../../store/staking/staking.thunks';
import { LoadableAmount } from '../../utils/types';
import { StakingComponent } from './Staking.component';
import { RewardBlockProps } from './Staking.types';

const mockFishStaked: LoadableAmount = {
  amount: '9,552.8567',
  isLoading: false,
};

const mockTotalRewards: LoadableAmount = {
  amount: '2000.0000',
  isLoading: false,
};

const mockVotingPower: LoadableAmount = {
  amount: '0.0000',
  isLoading: false,
};

const mockRewards: RewardBlockProps[] = [
  { amount: '0.0000', asset: 'XUSD', usdAmount: '0.0000' },
  { amount: '0.0000', asset: 'FISH', usdAmount: '0.0000' },
];

const Container = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initStakePageThunk());
  }, [dispatch]);

  return (
    <StakingComponent
      rewards={mockRewards}
      fishStaked={mockFishStaked}
      totalRewards={mockTotalRewards}
      votingPower={mockVotingPower}
    />
  );
};

export const StakingContainer = () => (
  <WalletConnectionChecker>
    <Container />
  </WalletConnectionChecker>
);
