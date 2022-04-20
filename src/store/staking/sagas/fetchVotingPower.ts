import { put, call, select } from 'typed-redux-saga';
import {
  accountSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import { stakingActions } from '../staking.slice';

export function* fetchVotingPower() {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);

    if (!staking || !account) {
      throw new Error('Wallet not connected');
    }

    const votingPower = yield* call(staking.getCurrentVotes, account);

    yield* put(stakingActions.setVotingPower(votingPower.toString()));
  } catch (e) {
    yield* put(stakingActions.fetchVotingPowerFailure());
  }
}
