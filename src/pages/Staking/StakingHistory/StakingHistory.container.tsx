import { StakingHistoryComponent } from './StakingHistory.component';
import { StakingHistoryListItem } from './StakingHistory.types';

const mockStakingHistory: StakingHistoryListItem[] = [
  {
    asset: 'FISH',
    stakedAmount: '100.0000',
    stakingDate: '2/01/2022 - 9:31:19 am GMT',
    totalStaked: '120.0000',
  },
  {
    asset: 'FISH',
    stakedAmount: '100.0000',
    stakingDate: '2/01/2022 - 9:31:19 am GMT',
    totalStaked: '120.0000',
  },
];

export const StakingHistoryContainer = () => (
  <StakingHistoryComponent stakes={mockStakingHistory} />
);
