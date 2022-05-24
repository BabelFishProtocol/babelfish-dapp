import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  stakesHistoryListSelector,
  stakesHistoryListStatusSelector,
} from '../../../store/staking/staking.selectors';
import { stakingActions } from '../../../store/staking/staking.slice';
import { StakingHistoryComponent } from './StakingHistory.component';

export const StakingHistoryContainer = () => {
  const dispatch = useDispatch();
  const stakingHistory = useSelector(stakesHistoryListSelector);
  const stakingHistoryState = useSelector(stakesHistoryListStatusSelector);

  useEffect(() => {
    dispatch(stakingActions.watchHistoryStakesList());

    return () => {
      dispatch(stakingActions.stopWatchingHistoryStakesList());
    };
  }, [dispatch]);

  return (
    <StakingHistoryComponent
      state={stakingHistoryState}
      stakes={stakingHistory}
    />
  );
};
