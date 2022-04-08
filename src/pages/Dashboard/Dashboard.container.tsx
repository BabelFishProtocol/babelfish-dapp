import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WalletConnectionChecker } from '../../components/WalletConnectionChecker/WalletConnectionChecker.component';
import {
  fishBalanceSelector,
  totalFishSelector,
  xusdBalanceSelector,
} from '../../store/dashboard/dashboard.selectors';
import { dashboardActions } from '../../store/dashboard/dashboard.slice';

import { DashboardComponent } from './Dashboard.component';

export const Container = () => {
  const dispatch = useDispatch();
  const fishBalance = useSelector(fishBalanceSelector);
  const totalFish = useSelector(totalFishSelector);
  const xusdBalance = useSelector(xusdBalanceSelector);

  useEffect(() => {
    dispatch(dashboardActions.watchData());

    return () => {
      dashboardActions.stopWatchingData();
    };
  }, [dispatch]);

  return (
    <DashboardComponent
      fishBalance={fishBalance}
      fishVesting={totalFish}
      totalUSD={xusdBalance}
    />
  );
};

export const DashboardContainer = () => (
  <WalletConnectionChecker>
    <Container />
  </WalletConnectionChecker>
);
