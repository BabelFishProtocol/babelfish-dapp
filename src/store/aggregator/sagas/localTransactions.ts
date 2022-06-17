import { select, call, put } from 'typed-redux-saga';
import { getCurrentTimestamp } from '../../../utils/helpers';
import {
  providerSelector,
  xusdLocalTransactionsSelector,
} from '../../app/app.selectors';
import { appActions } from '../../app/app.slice';
import { TxReceiptStatus } from '../../dashboard/sagas/fetchTransactions.types';
import {
  submitCallCurrentOperation,
  submitTxDetails,
} from '../aggregator.selectors';
import { AggregatorActions } from '../aggregator.slice';
import { XusdLocalTransaction } from '../aggregator.state';

export function* setLocalTx(tx: XusdLocalTransaction) {
  yield* put(appActions.setLocalXusdTransactions(tx));
}

export function* addTransactionIntoLocalStorage({
  payload,
}: AggregatorActions['setSubmitStepData']) {
  const currentOperation = yield* select(submitCallCurrentOperation);
  const txDetails = yield* select(submitTxDetails);

  if (
    !txDetails ||
    !payload.tx ||
    (currentOperation !== 'deposit' && currentOperation !== 'withdraw') ||
    currentOperation !== txDetails.event.toLowerCase()
  )
    return;

  let txToSave: XusdLocalTransaction;
  const timestamp = yield* call(getCurrentTimestamp);
  const date = timestamp.toString();

  if (
    txDetails.isCrossChain &&
    payload.txReceipt &&
    currentOperation === 'deposit' &&
    txDetails.event === 'Deposit'
  ) {
    txToSave = {
      ...txDetails,
      txHash: payload.txReceipt.transactionHash,
      asset: 'XUSD',
      status: 'Confirmed',
      date,
    };

    yield* setLocalTx(txToSave);
    return;
  }

  txToSave = {
    txHash: payload.tx.hash,
    asset: 'XUSD',
    date,
    ...txDetails,
  };

  yield* setLocalTx(txToSave);
}

export function* setFailedTransactionStatus() {
  const provider = yield* select(providerSelector);
  if (!provider) return;

  const localTx = yield* select(xusdLocalTransactionsSelector);
  if (!localTx) return;

  // eslint-disable-next-line no-restricted-syntax
  for (const tx of localTx) {
    // we have to handle this case in setFailedOnDepositCrossChainTx
    if (tx.event === 'Deposit' && tx.isCrossChain) {
      return;
    }

    const txReceipt = yield* call(
      [provider, provider.waitForTransaction],
      tx.txHash
    );

    if (txReceipt.status === TxReceiptStatus.Failed) {
      yield* put(
        appActions.updateLocalXusdTransactionStatus({
          txHash: tx.txHash,
          newStatus: 'Failed',
        })
      );
    }
  }
}

export function* setFailedOnDepositCrossChainTx() {
  const currentOperation = yield* select(submitCallCurrentOperation);
  const txDetails = yield* select(submitTxDetails);

  if (currentOperation === 'deposit' && txDetails?.isCrossChain) {
    const timestamp = yield* call(getCurrentTimestamp);

    yield* setLocalTx({
      ...txDetails,
      status: 'Failed',
      txHash: '0x0',
      asset: 'XUSD',
      date: timestamp.toString(),
    });
  }
}
