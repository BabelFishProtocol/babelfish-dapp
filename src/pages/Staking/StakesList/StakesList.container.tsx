import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  stakesListSelector,
  stakesListStatusSelector,
} from '../../../store/staking/staking.selectors';
import { fetchStakesListThunk } from '../../../store/staking/staking.thunks';

import { StakesListComponent } from './StakesList.component';

export const StakesListContainer = () => {
  const dispatch = useDispatch();

  const stakes = useSelector(stakesListSelector);
  const status = useSelector(stakesListStatusSelector);

  useEffect(() => {
    dispatch(fetchStakesListThunk());
  }, [dispatch]);

  return <StakesListComponent stakes={stakes} state={status} />;
};
