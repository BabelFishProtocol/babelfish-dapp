import { useSelector } from 'react-redux';

import {
  vestsListSelector,
  vestsListStatusSelector,
} from '../../../store/staking/staking.selectors';

import { VestsListComponent } from './VestsList.component';

export const VestsListContainer = () => {
  const vests = useSelector(vestsListSelector);
  const status = useSelector(vestsListStatusSelector);

  return <VestsListComponent vests={vests} state={status} />;
};
