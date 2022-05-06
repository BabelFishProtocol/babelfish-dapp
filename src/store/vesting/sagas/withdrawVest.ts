import { call, put, select } from 'typed-redux-saga';

import { SagaContractCallStep } from '../../types';
import { contractStepCallsSaga } from '../../utils/utils.sagas';

import { WithdrawVestCalls } from '../vesting.state';
import { selectedVestContractSelector } from '../vesting.selectors';
import { vestingActions, VestingActions } from '../vesting.slice';

export function* withdrawVest({ payload }: VestingActions['withdrawVest']) {
  const vesting = yield* select(selectedVestContractSelector);

  if (!vesting) {
    yield* put(vestingActions.setWithdrawError('Vesting not selected'));
    return;
  }

  const withdrawStep: SagaContractCallStep<WithdrawVestCalls> = {
    name: 'withdraw',
    effect: call(vesting.withdrawTokens, payload.withdrawTo.toLowerCase()),
  };

  yield* contractStepCallsSaga<WithdrawVestCalls>({
    steps: [withdrawStep],
    setErrorAction: vestingActions.setWithdrawError,
    setStatusAction: vestingActions.setWithdrawStatus,
    setStepDataAction: vestingActions.setWithdrawStepData,
  });
}
