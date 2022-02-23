import { useSelector } from 'react-redux';
import {
  kickoffTsSelector,
  selectedStakeSelector,
} from '../../../../store/staking/staking.selectors';

import { WithdrawStakeComponent } from './WithdrawStake.component';
import { WithdrawStakeContainerProps } from './WithdrawStake.types';

const mockTxFee = '0.00012';
const mockForfeitPercent = '20';
const mockForfeitWithdraw = '10.1200';

export const WithdrawStakeContainer = ({
  open,
  onClose,
}: WithdrawStakeContainerProps) => {
  const kickoffTs = useSelector(kickoffTsSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);

  if (!kickoffTs.data || !selectedStakeData) {
    return null;
  }

  return (
    <WithdrawStakeComponent
      open={open}
      onClose={onClose}
      txFee={mockTxFee}
      forfeitPercent={mockForfeitPercent}
      forfeitWithdraw={mockForfeitWithdraw}
      currentStakeAmount={selectedStakeData.lockedAmount}
    />
  );
};
