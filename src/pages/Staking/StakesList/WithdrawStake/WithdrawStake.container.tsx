import { useSelector } from 'react-redux';
import {
  stakingConstantsSelector,
  selectedStakeSelector,
} from '../../../../store/staking/staking.selectors';

import { WithdrawStakeComponent } from './WithdrawStake.component';
import { WithdrawStakeContainerProps } from './WithdrawStake.types';

const mockForfeitPercent = '20';
const mockForfeitWithdraw = '10.1200';

export const WithdrawStakeContainer = ({
  open,
  onClose,
}: WithdrawStakeContainerProps) => {
  const { kickoffTs } = useSelector(stakingConstantsSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);

  if (!kickoffTs || !selectedStakeData) {
    return null;
  }

  return (
    <WithdrawStakeComponent
      open={open}
      onClose={onClose}
      forfeitPercent={mockForfeitPercent}
      forfeitWithdraw={mockForfeitWithdraw}
      currentStakeAmount={selectedStakeData.lockedAmount}
    />
  );
};
