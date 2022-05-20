import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionsTableComponent } from './TransactionsTable.component';
import { dashboardActions } from '../../../store/dashboard/dashboard.slice';
import { transactionsSelector } from '../../../store/dashboard/dashboard.selectors';
import { xusdLocalTransactionsSelector } from '../../../store/app/app.selectors';

export const TransactionsTableContainer = () => {
  const { data: xusdSubgraphTx, state } = useSelector(transactionsSelector);
  const xusdLocalTx = useSelector(xusdLocalTransactionsSelector);

  // TODO is that ok to attach status here?
  const attachStatusToSubgraphTx = () =>
    xusdSubgraphTx.map((tx) => ({
      status: 'Confirmed' as const,
      ...tx,
    }));

  const transactions = xusdLocalTx
    ? [...xusdLocalTx, ...attachStatusToSubgraphTx()]
    : attachStatusToSubgraphTx();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dashboardActions.watchTransactions());

    return () => {
      dashboardActions.stopWatchingTransactions();
    };
  }, [dispatch]);

  return (
    <TransactionsTableComponent state={state} transactions={transactions} />
  );
};
