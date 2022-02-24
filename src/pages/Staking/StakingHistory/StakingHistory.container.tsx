import { StakingHistoryComponent } from './StakingHistory.component';
import { StakingHistoryListItem } from './StakingHistory.types';

const mockStakingHistory: StakingHistoryListItem[] = [
  {
    asset: 'FISH',
    stakedAmount: '1000000000000000',
    stakingDate: 1659570200,
    totalStaked: '1000000000000000000000000000',
  },
  {
    asset: 'FISH',
    stakedAmount: '12342342300000000000',
    stakingDate: 1659570200,
    totalStaked: '12342342300000000000',
  },
];

export const StakingHistoryContainer = () => (
  <StakingHistoryComponent stakes={mockStakingHistory} />
);
