import { select, call, put } from 'typed-redux-saga';
import { getCurrentTimestamp } from '../../../utils/helpers';
import { appActions } from '../../app/app.slice';
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

export function* setErrorOnDepositCrossChainTx() {
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
