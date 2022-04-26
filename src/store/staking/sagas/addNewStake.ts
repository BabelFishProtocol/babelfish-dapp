import { put } from 'typed-redux-saga';

import { contractStepCallsSaga } from '../../utils/utils.sagas';

import { AddNewStakeCalls } from '../staking.state';
import { createStakeSteps } from '../staking.utils';
import { StakingActions, stakingActions } from '../staking.slice';

export function* addNewStake({ payload }: StakingActions['addNewStake']) {
  const { unlockDate, stakeAmount } = payload;

  const { steps, error } = yield* createStakeSteps(stakeAmount, unlockDate);

  if (error) {
    yield* put(stakingActions.setAddStakeError(error));
    return;
  }

  yield* put(stakingActions.setAddStakeSteps(steps));

  yield* contractStepCallsSaga<AddNewStakeCalls>({
    steps,
    setErrorAction: stakingActions.setAddStakeError,
    setStatusAction: stakingActions.setAddStakeStatus,
    setStepDataAction: stakingActions.setAddStakeStepData,
  });
}
