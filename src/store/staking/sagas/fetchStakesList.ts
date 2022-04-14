import { put, call, select, all } from 'typed-redux-saga';
import {
  accountSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import { stakingActions } from '../staking.slice';
import { StakeListItem } from '../staking.state';

export function* fetchStakesList() {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);

    if (!staking || !account) {
      throw new Error('Wallet not connected');
    }

    const { stakes, dates } = yield* call(staking.getStakes, account);

    const delegates = yield* all(
      dates.map((date) => call(staking.delegates, account, date.toNumber()))
    );

    const stakesList: StakeListItem[] = dates.map((date, index) => ({
      asset: 'FISH',
      unlockDate: date.toNumber(),
      votingDelegation: delegates[index],
      lockedAmount: stakes[index].toString(),
    }));

    yield* put(stakingActions.setStakesList(stakesList));
  } catch (e) {
    yield* put(stakingActions.fetchStakesListFailure());
  }
}
