import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  // vestsListSelector,
  vestsListStatusSelector,
} from '../../../store/staking/staking.selectors';
import { VestsListItem } from '../../../store/staking/staking.state';

import { VestsListComponent } from './VestsList.component';

const mockVests: VestsListItem[] = [
  {
    asset: 'FISH',
    lockedAmount: '9552856700000000000000',
    votingPower: '10000000000000000000',
    votingDelegation: '0x0000000000000000000000000000000000000000',
    stakingPeriodStart: 1659571200,
    unlockDate: 1659571200,
  },
  {
    asset: 'FISH',
    lockedAmount: '2552856700000000000000',
    votingPower: '12000000000000000000',
    votingDelegation: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    stakingPeriodStart: 1659571200,
    unlockDate: 1639008000,
  },
];

export const VestsListContainer = () => {
  const dispatch = useDispatch();

  // const vests = useSelector(vestsListSelector);
  const status = useSelector(vestsListStatusSelector);

  useEffect(() => {
    // dispatch fetch vests list action;
  }, [dispatch]);

  return <VestsListComponent vests={mockVests} state={status} />;
};
