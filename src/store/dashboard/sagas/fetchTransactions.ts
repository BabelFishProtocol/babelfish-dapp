import { put, call, select } from 'typed-redux-saga';
import { createWatcherSaga } from '../../utils/utils.sagas';
import {
  accountSelector,
  providerSelector,
  subgraphClientSelector,
  xusdLocalTransactionsSelector,
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
      status: 'Confirmed',
      ...tx,
    }));

    yield* put(appActions.removeLocalXusdTransactions(txWithStatus));

    yield* put(dashboardActions.setTransactions(txWithStatus));
  } catch (e) {
    yield* put(dashboardActions.fetchTransactionsFailure());
  }
}

export function* setFailedTransactionStatus() {
  const provider = yield* select(providerSelector);
  if (!provider) return;

  const localTx = yield* select(xusdLocalTransactionsSelector);
  if (!localTx) return;

  // eslint-disable-next-line no-restricted-syntax
  for (const tx of localTx) {
    if (tx.event === 'Deposit' && tx.isCrossChain) {
      return;
    }

    const txReceipt = yield* call(
      [provider, provider.waitForTransaction],
      tx.txHash
    );
    if (txReceipt.status === 0) {
      yield put(
        appActions.updateLocalXusdTransactionStatus({
          txHash: tx.txHash,
          newStatus: 'Failed',
        })
      );
    }
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
