import { LoadableAmount } from '../../utils/types';
import { DashboardComponent } from './Dashboard.component';

export const DashboardContainer = () => {
  const mockFishBalance: LoadableAmount = {
    isLoading: false,
    amount: '200000000000000000000',
  };
  const mockFishVesting: LoadableAmount = {
    isLoading: false,
    amount: '200000000000000000000',
  };
  const mockTotalUSD = '100,000.00';

  return (
    <DashboardComponent
      fishBalance={mockFishBalance}
      fishVesting={mockFishVesting}
      totalUSD={mockTotalUSD}
    />
  );
};
