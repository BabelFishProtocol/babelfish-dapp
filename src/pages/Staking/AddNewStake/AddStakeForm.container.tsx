import { useSelector } from 'react-redux';

import {
  kichoffTsSelector,
  stakesDatesSelector,
} from '../../../store/staking/staking.selectors';

import { AddNewStakeComponent } from './AddNewStake.component';
import { AddNewStakeContainerProps } from './AddStakeForm.types';

export const AddNewStakeContainer = ({
  open,
  onClose,
}: AddNewStakeContainerProps) => {
  const kickoffTs = useSelector(kichoffTsSelector);
  const currentStakes = useSelector(stakesDatesSelector);

  if (!kickoffTs) {
    return null;
  }
  return (
    <AddNewStakeComponent
      open={open}
      onClose={onClose}
      kickoffTs={kickoffTs}
      stakes={currentStakes}
    />
  );
};
