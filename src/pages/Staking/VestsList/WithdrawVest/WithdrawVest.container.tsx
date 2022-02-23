import { useSelector } from 'react-redux';
import {
  stakingConstantsSelector,
  selectedVestSelector,
} from '../../../../store/staking/staking.selectors';

import { WithdrawVestComponent } from './WithdrawVest.component';
import { WithdrawVestContainerProps } from './WithdrawVest.types';

const mockUnlockedAmount = '0.0001';

export const WithdrawVestContainer = ({
  open,
  onClose,
}: WithdrawVestContainerProps) => {
  const { kickoffTs } = useSelector(stakingConstantsSelector);
  const selectedVestData = useSelector(selectedVestSelector);

  if (!kickoffTs.data || !selectedVestData) {
    return null;
  }

  return (
    <WithdrawVestComponent
      open={open}
      onClose={onClose}
      unlockedAmount={mockUnlockedAmount}
      delegate={selectedVestData.votingDelegation}
    />
  );
};
