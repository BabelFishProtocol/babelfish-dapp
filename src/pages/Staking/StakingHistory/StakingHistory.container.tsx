import { useSelector } from 'react-redux';
import {
  stakesHistoryListSelector,
  stakesHistoryListStatusSelector,
} from '../../../store/staking/staking.selectors';
import { StakingHistoryComponent } from './StakingHistory.component';

export const StakingHistoryContainer = () => {
  const stakingHistory = useSelector(stakesHistoryListSelector);
  const stakingHistoryState = useSelector(stakesHistoryListStatusSelector);

  return (
    <StakingHistoryComponent
      state={stakingHistoryState}
      stakes={stakingHistory}
    />
  );
};
