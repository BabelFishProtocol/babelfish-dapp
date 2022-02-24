import { useSelector } from 'react-redux';

import {
  kickoffTsSelector,
  stakesDatesSelector,
} from '../../../store/staking/staking.selectors';

import { AddNewStakeComponent } from './AddNewStake.component';
import {
  AddNewStakeContainerProps,
  AddNewStakeFormValues,
} from './AddNewStake.types';

const mockTxFee = '0.00012';
const mockVotingPower = '10.0000';

export const AddNewStakeContainer = ({
  open,
  onClose,
}: AddNewStakeContainerProps) => {
  const kickoffTs = useSelector(kickoffTsSelector);
  const currentStakes = useSelector(stakesDatesSelector);

  if (!kickoffTs.data) {
    return null;
  }

  const onSubmit = async (formValues: AddNewStakeFormValues) => {
    console.log({ formValues });
  };

  return (
    <AddNewStakeComponent
      open={open}
      onClose={onClose}
      txFee={mockTxFee}
      onSubmit={onSubmit}
      kickoffTs={kickoffTs.data}
      stakes={currentStakes}
      votingPower={mockVotingPower}
    />
  );
};
