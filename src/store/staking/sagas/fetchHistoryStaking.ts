import { put, select, take } from 'typed-redux-saga';
import {
  findStakingHistorySubscription,
  UserQueryParams,
  UserQueryResult,
} from '../../../queries/historyStakeListQuery';
import { accountSelector } from '../../app/app.selectors';
import { appActions } from '../../app/app.slice';
import { subscriptionSaga } from '../../utils/utils.sagas';
import { stakingActions } from '../staking.slice';

export function* fetchHistoryStaking(data: UserQueryResult | Error) {
  try {
    console.log('inside saga');
    yield* put(stakingActions.fetchHistoryStakesList());

    if (data instanceof Error) throw data;

    const stakesHistory = data.user.allStakes.map((stake) => ({
      asset: 'FISH',
      stakedAmount: stake.amount,
      unlockDate: stake.lockedUntil,
      totalStaked: stake.totalStaked,
      txHash: stake.transactionHash,
      blockTimestamp: stake.blockTimestamp,
    }));

    yield* put(stakingActions.setHistoryStakesList(stakesHistory));
  } catch (e) {
    console.log(e);
    yield* put(stakingActions.fetchHistoryStakesListFailure());
  }
}

export function* watchStakingHistory() {
  let account = yield* select(accountSelector);

  if (!account) {
    yield* take(appActions.walletConnected.type);
    account = (yield* select(accountSelector)) as string;
  }

  yield* subscriptionSaga<UserQueryResult, UserQueryParams>({
    query: findStakingHistorySubscription,
    variables: { contractAddress: account.toLowerCase() },
    fetchSaga: fetchHistoryStaking,
    stopAction: stakingActions.stopWatchingStakingData,
  });
}
