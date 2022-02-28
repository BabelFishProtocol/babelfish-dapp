import { useSelector } from 'react-redux';
import {
  stakingConstantsSelector,
  selectedStakeSelector,
  stakesDatesSelector,
} from '../../../../store/staking/staking.selectors';

import { ExtendStakeComponent } from './ExtendStake.component';
import { ExtendStakeContainerProps } from './ExtendStake.types';

const mockTxFee = '0.00012';
const mockNewVotingPower = '10.0000';

export const ExtendStakeContainer = ({
  open,
  onClose,
}: ExtendStakeContainerProps) => {
  const { kickoffTs } = useSelector(stakingConstantsSelector);
  const currentStakes = useSelector(stakesDatesSelector);
  const selectedStakeData = useSelector(selectedStakeSelector);

  if (!kickoffTs || !selectedStakeData) {
    return null;
  }

  return (
    <ExtendStakeComponent
      open={open}
      onClose={onClose}
      txFee={mockTxFee}
      stakes={currentStakes}
      kickoffTs={kickoffTs}
      votingPower={mockNewVotingPower}
      prevDate={selectedStakeData.unlockDate}
      stakedAmount={selectedStakeData.lockedAmount}
    />
  );
};
