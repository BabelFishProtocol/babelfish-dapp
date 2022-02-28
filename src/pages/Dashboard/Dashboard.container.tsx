import { LoadableAmount } from '../../store/types';
import { DashboardComponent } from './Dashboard.component';

export const DashboardContainer = () => {
  const mockFishBalance: LoadableAmount = {
    state: 'success',
    data: '200000000000000000000',
  };
  const mockFishVesting: LoadableAmount = {
    state: 'success',
    data: '200000000000000000000',
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
