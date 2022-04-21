import { tokens } from '../../config/tokens';
import { ImprobabilityComponent } from './Improbability.component';

const mockCoins = () =>
  Object.values(tokens).map((token) => ({
    ...token,
    apr: 15,
    pool: 20,
    balance: '20',
    earnedInKind: '-',
    earnedInXusd: '-',
  }));

export const ImprobabilityContainer = () => {
  const coins = mockCoins();
  const state = 'idle';
  return <ImprobabilityComponent coins={coins} state={state} />;
};
