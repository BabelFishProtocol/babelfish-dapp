import { useSelector } from 'react-redux';
import { stakesHistoryListSelector } from '../../../store/staking/staking.selectors';
import { StakingHistoryComponent } from './StakingHistory.component';

export const StakingHistoryContainer = () => {
  const stakingHistory = useSelector(stakesHistoryListSelector);

  return <StakingHistoryComponent state="idle" stakes={stakingHistory} />;
};
