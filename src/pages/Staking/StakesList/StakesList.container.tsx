import { useSelector } from 'react-redux';

import {
  stakesListSelector,
  stakesListStatusSelector,
} from '../../../store/staking/staking.selectors';

import { StakesListComponent } from './StakesList.component';

export const StakesListContainer = () => {
  const stakes = useSelector(stakesListSelector);
  const status = useSelector(stakesListStatusSelector);

  return <StakesListComponent stakes={stakes} state={status} />;
};
