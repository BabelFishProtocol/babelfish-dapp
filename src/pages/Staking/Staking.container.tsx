import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WalletConnectionChecker } from '../../components/WalletConnectionChecker/WalletConnectionChecker.component';
import {
  fishTokenDataSelector,
  combinedVotingPowerSelector,
  fishLoadingStateSelector,
} from '../../store/staking/staking.selectors';
import { stakingActions } from '../../store/staking/staking.slice';
import { LoadableAmount } from '../../store/types';

import { StakingComponent } from './Staking.component';
import { RewardBlockProps } from './Staking.types';

const mockTotalRewards: LoadableAmount = {
  data: '0',
  state: 'success',
};

const mockRewards: RewardBlockProps[] = [
  { amount: '0', asset: 'XUSD', usdAmount: '0.00' },
  { amount: '0', asset: 'FISH', usdAmount: '0.00' },
];

const Container = () => {
  const dispatch = useDispatch();
  const { fishBalance } = useSelector(fishTokenDataSelector);
  const fishLoadingState = useSelector(fishLoadingStateSelector);
  const combinedVotingPower = useSelector(combinedVotingPowerSelector);

  useEffect(() => {
    dispatch(stakingActions.watchStakingData());

    return () => {
      dispatch(stakingActions.stopWatchingStakingData());
    };
  }, [dispatch]);

  return (
    <StakingComponent
      rewards={mockRewards}
      totalRewards={mockTotalRewards}
      votingPower={combinedVotingPower}
      fishStaked={{ state: fishLoadingState, data: fishBalance }}
    />
  );
};

export const StakingContainer = () => (
  <WalletConnectionChecker>
    <Container />
  </WalletConnectionChecker>
);
