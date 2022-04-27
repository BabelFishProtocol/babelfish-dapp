import { put, call, select } from 'typed-redux-saga';
import { userQuery } from '../../../queries/historyStakeListQuery';
import {
  accountSelector,
  subgraphClientSelector,
} from '../../app/app.selectors';
import { compareNumbers } from '../../../utils/helpers';
import { stakingActions } from '../staking.slice';

export function* fetchHistoryStaking() {
  try {
    const subgraphClient = yield* select(subgraphClientSelector);
    const account = yield* select(accountSelector);

    if (!subgraphClient || !account) throw new Error('Wallet not connected');

    const { user } = yield* call(userQuery, subgraphClient, {
      contractAddress: account.toLowerCase(),
    });

    const stakesHistory = user.stakes.map((stake) => ({
      asset: 'FISH',
      stakedAmount: stake.amount,
      unlockDate: stake.lockedUntil,
      totalStaked: stake.totalStaked,
      txHash: stake.transactionHash,
      blockTimeStamp: stake.blockTimeStamp,
    }));

    stakesHistory.sort((stakePrev, stakeNext) =>
      compareNumbers(
        Number(stakePrev.blockTimeStamp),
        Number(stakeNext.blockTimeStamp)
      )
    );
    const reversedStakesHistory = stakesHistory.reverse();

    yield* put(stakingActions.setHistoryStakesList(reversedStakesHistory));
  } catch (e) {
    yield* put(stakingActions.fetchHistoryStakesListFailure());
  }
}
