import { call, put, select } from 'typed-redux-saga';

import { contractStepCallsSaga } from '../../utils/utils.sagas';
import { SagaContractCallStep } from '../../types';

import { stakingContractSelector } from '../../app/app.selectors';

import { ExtendCalls } from '../staking.state';
import { selectedStakeSelector } from '../staking.selectors';
import { StakingActions, stakingActions } from '../staking.slice';

export function* extendStake({ payload }: StakingActions['extendStake']) {
  const { unlockDate } = payload;

  const staking = yield* select(stakingContractSelector);
  const selectedStake = yield* select(selectedStakeSelector);

  if (!staking) {
    yield* put(stakingActions.setExtendError('Wallet not connected'));
    return;
  }

  if (!selectedStake) {
    yield* put(stakingActions.setExtendError('No stake selected'));
    return;
  }

  const extendStep: SagaContractCallStep<ExtendCalls> = {
    name: 'extend',
    effect: call(
      staking.extendStakingDuration,
      selectedStake.unlockDate,
      unlockDate
    ),
  };

  yield* contractStepCallsSaga<ExtendCalls>({
    steps: [extendStep],
    setErrorAction: stakingActions.setExtendError,
    setStatusAction: stakingActions.setExtendStatus,
    setStepDataAction: stakingActions.setExtendStepData,
  });
}
