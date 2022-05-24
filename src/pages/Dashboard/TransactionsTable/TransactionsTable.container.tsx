import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionsTableComponent } from './TransactionsTable.component';
import { dashboardActions } from '../../../store/dashboard/dashboard.slice';
import { transactionsSelector } from '../../../store/dashboard/dashboard.selectors';
import {
  providerSelector,
  xusdLocalTransactionsSelector,
} from '../../../store/app/app.selectors';
import { appActions } from '../../../store/app/app.slice';

export const TransactionsTableContainer = () => {
  const dispatch = useDispatch();

  const localTx = useSelector(xusdLocalTransactionsSelector);
  const provider = useSelector(providerSelector);
  const { data, state } = useSelector(transactionsSelector);

  useEffect(() => {
    localTx?.forEach(async (tx) => {
      const providerTx = await provider?.getTransaction(tx.txHash);
      await providerTx
        ?.wait()
        .then(() =>
          dispatch(
            appActions.updateLocalXusdTransactionStatus({
              txHash: tx.txHash,
              newStatus: 'Confirmed',
            })
          )
        )
        .catch(() =>
          dispatch(
            appActions.updateLocalXusdTransactionStatus({
              txHash: tx.txHash,
              newStatus: 'Failed',
            })
          )
        );
    });
  }, [dispatch, provider, localTx]);

  useEffect(() => {
    dispatch(dashboardActions.watchTransactions());

    return () => {
      dashboardActions.stopWatchingTransactions();
    };
  }, [dispatch]);

  return <TransactionsTableComponent state={state} transactions={data} />;
};
