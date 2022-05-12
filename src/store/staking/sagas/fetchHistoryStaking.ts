import { put, call, select } from 'typed-redux-saga';
import { allUserStakesQuery } from '../../../queries/historyStakeListQuery';
import {
  accountSelector,
  subgraphClientSelector,
} from '../../app/app.selectors';
import { stakingActions } from '../staking.slice';

export function* fetchHistoryStaking() {
  try {
    const subgraphClient = yield* select(subgraphClientSelector);
    const account = yield* select(accountSelector);

    if (!subgraphClient || !account) throw new Error('Wallet not connected');

    const { user } = yield* call(allUserStakesQuery, subgraphClient, {
      contractAddress: account.toLowerCase(),
    });

    const stakesHistory = user.allStakes.map((stake) => ({
      asset: 'FISH',
      stakedAmount: stake.amount,
      unlockDate: stake.lockedUntil,
      totalStaked: stake.totalStaked,
      txHash: stake.transactionHash,
      blockTimestamp: stake.blockTimestamp,
    }));

    yield* put(stakingActions.setHistoryStakesList(stakesHistory));
  } catch (e) {
    yield* put(stakingActions.fetchHistoryStakesListFailure());
  }
}
