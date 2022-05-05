import { utils } from 'ethers';
import { call, put, select } from 'typed-redux-saga';

import { contractStepCallsSaga } from '../../utils/utils.sagas';
import { SagaContractCallStep } from '../../types';

import {
  accountSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import { WithdrawCalls } from '../staking.state';
import { selectedStakeSelector } from '../staking.selectors';
import { StakingActions, stakingActions } from '../staking.slice';

export function* withdrawStake({ payload }: StakingActions['withdrawStake']) {
  const { withdrawStakeAmount } = payload;

  const account = yield* select(accountSelector);
  const staking = yield* select(stakingContractSelector);
  const selectedStake = yield* select(selectedStakeSelector);

  if (!staking || !account) {
    yield* put(stakingActions.setExtendError('Wallet not connected'));
    return;
  }

  if (!selectedStake) {
    yield* put(stakingActions.setExtendError('No stake selected'));
    return;
  }

  const withdrawStep: SagaContractCallStep<WithdrawCalls> = {
    name: 'withdraw',
    effect: call(
      staking.withdraw,
      utils.parseEther(withdrawStakeAmount),
      selectedStake.unlockDate,
      account
    ),
  };

  yield* contractStepCallsSaga({
    steps: [withdrawStep],
    setErrorAction: stakingActions.setWithdrawalError,
    setStatusAction: stakingActions.setWithdrawalStatus,
    setStepDataAction: stakingActions.setWithdrawalStepData,
  });
}
