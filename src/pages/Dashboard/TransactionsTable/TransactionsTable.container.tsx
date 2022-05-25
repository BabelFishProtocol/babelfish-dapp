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

  const localXusdTransactions = useSelector(xusdLocalTransactionsSelector);
  const provider = useSelector(providerSelector);
  const { data, state } = useSelector(transactionsSelector);

  useEffect(() => {
    localXusdTransactions?.forEach(async ({ txHash }) => {
      const providerTx = await provider?.getTransaction(txHash);
      await providerTx?.wait().catch(() =>
        dispatch(
          appActions.updateLocalXusdTransactionStatus({
            txHash,
            newStatus: 'Failed',
          })
        )
      );
    });
  }, [dispatch, provider, localXusdTransactions]);

  useEffect(() => {
    dispatch(dashboardActions.watchTransactions());

    return () => {
      dashboardActions.stopWatchingTransactions();
    };
  }, [dispatch]);

  return <TransactionsTableComponent state={state} transactions={data} />;
};
