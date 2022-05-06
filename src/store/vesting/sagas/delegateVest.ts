import { call, put, select } from 'typed-redux-saga';

import { contractStepCallsSaga } from '../../utils/utils.sagas';
import { SagaContractCallStep } from '../../types';

import { DelegateVestCalls } from '../vesting.state';
import { selectedVestContractSelector } from '../vesting.selectors';
import { vestingActions, VestingActions } from '../vesting.slice';

export function* delegateVest({ payload }: VestingActions['delegateVest']) {
  const vesting = yield* select(selectedVestContractSelector);

  if (!vesting) {
    yield* put(vestingActions.setDelegateError('Vesting not selected'));
    return;
  }

  const delegateStep: SagaContractCallStep<DelegateVestCalls> = {
    name: 'delegate',
    effect: call(vesting.delegate, payload.delegateTo.toLowerCase()),
  };

  yield* contractStepCallsSaga<DelegateVestCalls>({
    steps: [delegateStep],
    setErrorAction: vestingActions.setDelegateError,
    setStatusAction: vestingActions.setDelegateStatus,
    setStepDataAction: vestingActions.setDelegateStepData,
  });
}
