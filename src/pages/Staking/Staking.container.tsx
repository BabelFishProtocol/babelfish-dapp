import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initStakePageThunk } from '../../store/staking/staking.thunks';
import { LoadableAmount } from '../../utils/types';
import { StakingComponent } from './Staking.component';
import { RewardBlockProps } from './Staking.types';

const mockFishStaked: LoadableAmount = {
  amount: '9552856700000000000000',
  isLoading: false,
};

const mockTotalRewards: LoadableAmount = {
  amount: '2000000000000000000000',
  isLoading: false,
};

const mockVotingPower: LoadableAmount = {
  amount: '1023000000000000000',
  isLoading: false,
};

const mockRewards: RewardBlockProps[] = [
  { amount: '0', asset: 'XUSD', usdAmount: '0.00' },
  { amount: '0', asset: 'FISH', usdAmount: '0.00' },
];

export const StakingContainer = () => {
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
