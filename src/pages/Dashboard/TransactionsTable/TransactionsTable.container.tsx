import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionsTableComponent } from './TransactionsTable.component';
import { dashboardActions } from '../../../store/dashboard/dashboard.slice';
import { transactionsSelector } from '../../../store/dashboard/dashboard.selectors';

export const TransactionsTableContainer = () => {
  const { data, state } = useSelector(transactionsSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dashboardActions.watchTransactions());

    return () => {
      dashboardActions.stopWatchingTransactions();
    };
  }, [dispatch]);

  return (
    <TransactionsTableComponent
      state={state}
      transactions={data}
    />
  );
};
