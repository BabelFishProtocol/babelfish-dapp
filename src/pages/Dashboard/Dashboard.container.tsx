import { LoadableAmount } from '../../store/types';
import { DashboardComponent } from './Dashboard.component';

export const DashboardContainer = () => {
  const mockFishBalance: LoadableAmount = {
    state: 'success',
    data: '200.0000',
  };
  const mockFishVesting: LoadableAmount = {
    state: 'success',
    data: '200.0000',
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
