import { put, select } from 'typed-redux-saga';

import { contractStepCallsSaga } from '../../utils/utils.sagas';

import { IncreaseCalls } from '../staking.state';
import { createStakeSteps } from '../staking.utils';
import { selectedStakeSelector } from '../staking.selectors';
import { StakingActions, stakingActions } from '../staking.slice';

export function* increaseStake({ payload }: StakingActions['increaseStake']) {
  const { increaseStakeAmount } = payload;

  const selectedStakeData = yield* select(selectedStakeSelector);

  if (!selectedStakeData) {
    yield* put(stakingActions.setIncreaseError('No stake selected'));
    return;
  }

  const { steps, error } = yield* createStakeSteps(
    increaseStakeAmount,
    selectedStakeData.unlockDate
  );

  if (error) {
    yield* put(stakingActions.setIncreaseError(error));
    return;
  }

  yield* put(stakingActions.setIncreaseSteps(steps));

  yield* contractStepCallsSaga<IncreaseCalls>({
    steps,
    setErrorAction: stakingActions.setIncreaseError,
    setStatusAction: stakingActions.setIncreaseStatus,
    setStepDataAction: stakingActions.setIncreaseStepData,
  });
}
