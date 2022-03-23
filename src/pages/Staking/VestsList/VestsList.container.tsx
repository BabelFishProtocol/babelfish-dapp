import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  vestsListSelector,
  vestsListStatusSelector,
} from '../../../store/vesting/vesting.selectors';
import { vestingActions } from '../../../store/vesting/vesting.slice';

import { VestsListComponent } from './VestsList.component';

export const VestsListContainer = () => {
  const vests = useSelector(vestsListSelector);
  const status = useSelector(vestsListStatusSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(vestingActions.watchVestingData());

    return () => {
      dispatch(vestingActions.stopWatchingVestingData());
    };
  }, [dispatch]);

  return <VestsListComponent vests={vests} state={status} />;
};
