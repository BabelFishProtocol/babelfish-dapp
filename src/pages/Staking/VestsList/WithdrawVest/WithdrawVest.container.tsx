import { useSelector } from 'react-redux';
import {
  kickoffTsSelector,
  selectedVestSelector,
} from '../../../../store/staking/staking.selectors';

import { WithdrawVestComponent } from './WithdrawVest.component';
import { WithdrawVestContainerProps } from './WithdrawVest.types';

const mockTxFee = '0.00012';
const mockUnlockedAmount = '0.0001';

export const WithdrawVestContainer = ({
  open,
  onClose,
}: WithdrawVestContainerProps) => {
  const kickoffTs = useSelector(kickoffTsSelector);
  const selectedVestData = useSelector(selectedVestSelector);

  if (!kickoffTs.data || !selectedVestData) {
    return null;
  }

  return (
    <WithdrawVestComponent
      open={open}
      onClose={onClose}
      txFee={mockTxFee}
      unlockedAmount={mockUnlockedAmount}
      delegate={selectedVestData.votingDelegation}
    />
  );
};
