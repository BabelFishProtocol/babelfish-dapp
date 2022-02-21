import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  vestsListSelector,
  vestsListStatusSelector,
} from '../../../store/staking/staking.selectors';
import { fetchVestsListThunk } from '../../../store/staking/staking.thunks';

import { VestsListComponent } from './VestsList.component';

export const VestsListContainer = () => {
  const dispatch = useDispatch();

  const vests = useSelector(vestsListSelector);
  const status = useSelector(vestsListStatusSelector);

  useEffect(() => {
    dispatch(fetchVestsListThunk());
  }, [dispatch]);

  return <VestsListComponent vests={vests} state={status} />;
};
