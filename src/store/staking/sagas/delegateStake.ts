import { call, put, select } from 'typed-redux-saga';

import { contractStepCallsSaga } from '../../utils/utils.sagas';
import { SagaContractCallStep } from '../../types';

import { stakingContractSelector } from '../../app/app.selectors';

import { DelegateCalls } from '../staking.state';
import { selectedStakeSelector } from '../staking.selectors';
import { StakingActions, stakingActions } from '../staking.slice';

export function* delegateStake({ payload }: StakingActions['delegateStake']) {
  const { delegateTo } = payload;

  const staking = yield* select(stakingContractSelector);
  const selectedStake = yield* select(selectedStakeSelector);

  if (!staking) {
    yield* put(stakingActions.setDelegateError('Wallet not connected'));
    return;
  }

  if (!selectedStake) {
    yield* put(stakingActions.setDelegateError('No stake selected'));
    return;
  }

  const delegateStep: SagaContractCallStep<DelegateCalls> = {
    name: 'delegate',
    effect: call(
      staking.delegate,
      delegateTo.toLowerCase(),
      selectedStake.unlockDate
    ),
  };

  yield* contractStepCallsSaga<DelegateCalls>({
    steps: [delegateStep],
    setErrorAction: stakingActions.setDelegateError,
    setStatusAction: stakingActions.setDelegateStatus,
    setStepDataAction: stakingActions.setDelegateStepData,
  });
}
