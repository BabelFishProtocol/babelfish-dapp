import { ImprobabilityComponent } from './Improbability.component';
import { mockCoins } from './Improbability.mock';

export const ImprobabilityContainer = () => {
  const coins = mockCoins;
  const state = 'idle';
  return <ImprobabilityComponent coins={coins} state={state} />;
};
