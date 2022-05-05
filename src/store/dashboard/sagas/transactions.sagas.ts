import { put, call, select } from 'typed-redux-saga';
import { createWatcherSaga } from '../../utils/utils.sagas';
import { subgraphClientSelector } from '../../app/app.selectors';
import { transactionsQuery } from '../../../queries/transactionsQuery';
import { dashboardActions } from '../dashboard.slice';

export function* fetchTransactions() {
  try {
    const subgraphClient = yield* select(subgraphClientSelector);
    if (!subgraphClient) throw new Error('Wallet not connected!');

    const { xusdTransactions } = yield* call(transactionsQuery, subgraphClient);

    yield* put(dashboardActions.setTransactions(xusdTransactions));
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
