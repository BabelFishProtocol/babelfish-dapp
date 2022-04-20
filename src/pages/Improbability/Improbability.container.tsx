import { ImprobabilityComponent } from './Improbability.component';
import { Coin } from './Improbability.types';

const mockCoins: Coin[] = [
  {
    id: 'aa',
    name: 'USDT',
    balance: '10',
    pool: 6,
    apr: 15,
    earnedInKind: '-',
    earnedInWxusd: '-',
  },
];

export const ImprobabilityContainer = () => {
  const state = 'idle';
  return <ImprobabilityComponent coins={mockCoins} state={state} />;
};
