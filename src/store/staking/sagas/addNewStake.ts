import { put, call, select } from 'typed-redux-saga';
import { BigNumber, constants, utils } from 'ethers';

import { ONE_DAY } from '../../../constants';
import { SagaContractCallStep } from '../../types';
import { contractStepCallsSaga } from '../../utils/utils.sagas';

import {
  fishTokenSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import { AddNewStakeCalls } from '../staking.state';
import { fishTokenDataSelector } from '../staking.selectors';
import { StakingActions, stakingActions } from '../staking.slice';

export function* addNewStake({ payload }: StakingActions['addNewStake']) {
  const { unlockDate, stakeAmount } = payload;
  const parsedStakeAmount = utils.parseEther(stakeAmount);

  const staking = yield* select(stakingContractSelector);
  const fishToken = yield* select(fishTokenSelector);
  const { allowanceForStaking } = yield* select(fishTokenDataSelector);

  if (!staking || !fishToken) {
    yield* put(stakingActions.setAddStakeError('Wallet not connected'));
    return;
  }

  const steps: SagaContractCallStep<AddNewStakeCalls>[] = [];

  if (BigNumber.from(allowanceForStaking).lt(parsedStakeAmount)) {
    steps.push({
      name: 'approve',
      effect: call(fishToken.approve, staking.address, parsedStakeAmount),
    });
  }

  steps.push({
    name: 'stake',
    effect: call(
      staking.stake,
      parsedStakeAmount,
      unlockDate + ONE_DAY, // adding 24 hours to date to make sure contract will not choose previous period,
      constants.AddressZero,
      constants.AddressZero
    ),
  });

  yield* put(stakingActions.setAddStakeSteps(steps));

  yield* contractStepCallsSaga<AddNewStakeCalls>({
    steps,
    setErrorAction: stakingActions.setAddStakeError,
    setStatusAction: stakingActions.setAddStakeStatus,
    setStepDataAction: stakingActions.setAddStakeStateStepData,
  });
}
