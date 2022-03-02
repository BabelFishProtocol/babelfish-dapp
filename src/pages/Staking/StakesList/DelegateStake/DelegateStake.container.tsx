import { useSelector } from 'react-redux';

import { selectedStakeSelector } from '../../../../store/staking/staking.selectors';

import { DelegateStakeComponent } from './DelegateStake.component';
import { DelegateStakeContainerProps } from './DelegateStake.types';

const mockAccount = '0x0000000000000000000000000000000000000000';

export const DelegateStakeContainer = ({
  open,
  onClose,
}: DelegateStakeContainerProps) => {
  const selectedStakeData = useSelector(selectedStakeSelector);

  if (!selectedStakeData) {
    return null;
  }

  return (
    <DelegateStakeComponent
      open={open}
      onClose={onClose}
      account={mockAccount}
      currentDelegate={selectedStakeData.votingDelegation}
    />
  );
};
