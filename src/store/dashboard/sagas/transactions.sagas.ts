import { put, call, select } from 'typed-redux-saga';
import { createWatcherSaga } from '../../utils/utils.sagas';
import { subgraphClientSelector } from '../../app/app.selectors';
import { transactionsQuery } from '../../../queries/transactionsQuery';
import { dashboardActions } from '../dashboard.slice';
import { mockedAccount as account } from './transactions.mocks';

export function* fetchTransactions() {
  try {
    const subgraphClient = yield* select(subgraphClientSelector);

    /* TODO: for now we are using mocked account address,
    that alrady have some tx on testnet,
    but in prod we should use selector to grab current wallet address 

    const account = yield* select(accountSelector);
    */

    if (!subgraphClient || !account) throw new Error('Wallet not connected!');

    const { xusdTransactions } = yield* call(
      transactionsQuery,
      subgraphClient,
      { user: account }
    );

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
