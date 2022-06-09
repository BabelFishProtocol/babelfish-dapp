import { put, call, select } from 'typed-redux-saga';
import { createWatcherSaga } from '../../utils/utils.sagas';
import {
  accountSelector,
  subgraphClientSelector,
} from '../../app/app.selectors';
import { transactionsQuery } from '../../../queries/transactionsQuery';
import { dashboardActions } from '../dashboard.slice';
import { appActions } from '../../app/app.slice';
import { XusdLocalTransaction } from '../../aggregator/aggregator.state';

export function* fetchTransactions() {
  try {
    const subgraphClient = yield* select(subgraphClientSelector);
    const account = yield* select(accountSelector);

    if (!subgraphClient || !account) throw new Error('Wallet not connected!');

    const { xusdTransactions } = yield* call(
      transactionsQuery,
      subgraphClient,
      { user: account }
    );

    const txWithStatus: XusdLocalTransaction[] = xusdTransactions.map((tx) => ({
      ...tx,
      status: 'Confirmed',
    }));

    yield* put(appActions.removeLocalXusdTransactions(txWithStatus));

    yield* put(dashboardActions.setTransactions(txWithStatus));
  } catch (e) {
    yield* put(dashboardActions.fetchTransactionsFailure());
  }
}

function* triggerFetch() {
  yield* put(dashboardActions.fetchTransactions());
}

function* triggerUpdate() {
  yield* put(dashboardActions.updateTransactions());
}

export const watchTransactions = createWatcherSaga({
  fetchSaga: triggerFetch,
  updateSaga: triggerUpdate,
  stopAction: dashboardActions.stopWatchingTransactions.type,
});
