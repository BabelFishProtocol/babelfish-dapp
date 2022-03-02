import { LoadableAmount } from '../../store/types';

export type DashboardComponentProps = {
  fishBalance: LoadableAmount;
  fishVesting: LoadableAmount;
  totalUSD: string;
};
