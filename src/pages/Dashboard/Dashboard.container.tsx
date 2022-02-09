import { LoadableAmount } from '../../utils/types';
import { DashboardComponent } from './Dashboard.component';

export const DashboardContainer = () => {
  const mockFishBalance: LoadableAmount = {
    isLoading: false,
    amount: '200.0000',
  };
  const mockFishVesting: LoadableAmount = {
    isLoading: false,
    amount: '200.0000',
  };
  const mockTotalUSD = '10,000.0000';

  return (
    <DashboardComponent
      fishBalance={mockFishBalance}
      fishVesting={mockFishVesting}
      totalUSD={mockTotalUSD}
    />
  );
};
