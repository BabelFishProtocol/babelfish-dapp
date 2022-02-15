import { useSelector } from 'react-redux';

import { selectedStakeSelector } from '../../../../store/staking/staking.selectors';

import { DelegateStakeComponent } from './DelegateStake.component';
import { DelegateStakeContainerProps } from './DelegateStake.types';

const mockTxFee = '0.00012';

export const DelegateStakeContainer = ({
  open,
  onClose,
}: DelegateStakeContainerProps) => {
  const selectedStakeData = useSelector(selectedStakeSelector);

  if (!selectedStakeData) {
    return null;
  }

  return (
    <DelegateStakeComponent open={open} onClose={onClose} txFee={mockTxFee} />
  );
};
