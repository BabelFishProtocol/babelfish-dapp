import { useSelector } from 'react-redux';

import { selectedVestSelector } from '../../../../store/staking/staking.selectors';

import { DelegateVestComponent } from './DelegateVest.component';
import { DelegateVestContainerProps } from './DelegateVest.types';

const mockVotingPower = '15.0000';

export const DelegateVestContainer = ({
  open,
  onClose,
}: DelegateVestContainerProps) => {
  const selectedVestData = useSelector(selectedVestSelector);

  if (!selectedVestData) {
    return null;
  }

  return (
    <DelegateVestComponent
      open={open}
      onClose={onClose}
      votingPower={mockVotingPower}
      currentDelegate={selectedVestData.votingDelegation}
    />
  );
};
