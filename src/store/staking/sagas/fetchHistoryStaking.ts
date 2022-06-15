import { put, select, take } from 'typed-redux-saga';
import { IGetUserQuery, IGetUserQueryVariables } from '../../../gql/graphql';
import { findStakingHistorySubscription } from '../../../queries/historyStakeListQuery';
import { accountSelector } from '../../app/app.selectors';
import { appActions } from '../../app/app.slice';
import { SubscriptionResponse } from '../../types';
import { subscriptionSaga } from '../../utils/utils.sagas';
import { stakingActions } from '../staking.slice';

export function* fetchHistoryStaking(
  queryResult: SubscriptionResponse<IGetUserQuery>
) {
  try {
    yield* put(stakingActions.fetchHistoryStakesList());

    if (queryResult.isError) throw queryResult.error;

    const stakesHistory = queryResult.data?.user?.allStakes?.map((stake) => ({
      asset: 'FISH',
      stakedAmount: stake.amount,
      unlockDate: stake.lockedUntil,
      totalStaked: stake.totalStaked,
      txHash: stake.transactionHash,
      blockTimestamp: stake.blockTimestamp,
    }));

    yield* put(stakingActions.setHistoryStakesList(stakesHistory || []));
  } catch (e) {
    yield* put(stakingActions.fetchHistoryStakesListFailure());
  }
}

export function* watchStakingHistory() {
  let account = yield* select(accountSelector);

  if (!account) {
    yield* take(appActions.walletConnected.type);
    account = (yield* select(accountSelector)) as string;
  }

  yield* subscriptionSaga<IGetUserQuery, IGetUserQueryVariables>({
    query: findStakingHistorySubscription,
    variables: { contractAddress: account.toLowerCase() },
    fetchSaga: fetchHistoryStaking,
    stopAction: stakingActions.stopWatchingStakingData,
    watchDataAction: stakingActions.watchHistoryStakesList,
  });
}
