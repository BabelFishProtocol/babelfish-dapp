import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  // stakesListSelector,
  stakesListStatusSelector,
} from '../../../store/staking/staking.selectors';
import { StakeListItem } from '../../../store/staking/staking.state';

import { StakesListComponent } from './StakesList.component';

const mockStakes: StakeListItem[] = [
  {
    asset: 'FISH',
    lockedAmount: '9,552.8567',
    votingPower: '0.0000',
    votingDelegation: 'No Delegate',
    stakingPeriod: '373 days',
    unlockDate: 1659571200,
  },
  {
    asset: 'FISH',
    lockedAmount: '2,552.8567',
    votingPower: '12.0000',
    votingDelegation: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    stakingPeriod: 'Expired',
    unlockDate: 1677715200,
  },
  {
    asset: 'FISH',
    lockedAmount: '0.8567',
    votingPower: '0.0000',
    votingDelegation: 'No Delegate',
    stakingPeriod: '373 days',
    unlockDate: 1639008000,
  },
];

export const StakesListContainer = () => {
  const dispatch = useDispatch();

  // const stakes = useSelector(stakesListSelector);
  const status = useSelector(stakesListStatusSelector);

  useEffect(() => {
    // dispatch stakes list action;
  }, [dispatch]);

  return <StakesListComponent stakes={mockStakes} state={status} />;
};
