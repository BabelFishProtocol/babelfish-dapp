import { BigNumber, constants, utils } from 'ethers';
import { call, select } from 'typed-redux-saga';

import { ONE_DAY } from '../../constants';
import {
  fishTokenSelector,
  stakingContractSelector,
} from '../app/app.selectors';
import { SagaContractCallStep } from '../types';
import { fishTokenDataSelector } from './staking.selectors';

type Result = {
  error?: string;
  steps: SagaContractCallStep<'approve' | 'stake'>[];
};

export function* createStakeSteps(stakeAmount: string, unlockDate: number) {
  const staking = yield* select(stakingContractSelector);
  const fishToken = yield* select(fishTokenSelector);
  const { allowanceForStaking } = yield* select(fishTokenDataSelector);

  const result: Result = {
    steps: [],
  };

  if (!staking || !fishToken) {
    result.error = 'Wallet not connected';

    return result;
  }

  const parsedStakeAmount = utils.parseEther(stakeAmount);

  if (BigNumber.from(allowanceForStaking).lt(parsedStakeAmount)) {
    result.steps.push({
      name: 'approve',
      effect: call(fishToken.approve, staking.address, parsedStakeAmount),
    });
  }

  result.steps.push({
    name: 'stake',
    effect: call(
      staking.stake,
      parsedStakeAmount,
      unlockDate + ONE_DAY, // adding 24 hours to date to make sure contract will not choose previous period,
      constants.AddressZero,
      constants.AddressZero
    ),
  });

  return result;
}
