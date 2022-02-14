import { LoadableAmount } from '../../utils/types';

export type DashboardComponentProps = {
  fishBalance: LoadableAmount;
  fishVesting: LoadableAmount;
  totalUSD: string;
};
