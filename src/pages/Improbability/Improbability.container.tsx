import { useSelector } from 'react-redux';
import { mockCoins } from './Improbability.mock';
import { ImprobabilityComponent } from './Improbability.component';
import { chainsInCurrentNetworkSelector } from '../../store/app/app.selectors';

export const ImprobabilityContainer = () => {
  const coins = mockCoins;
  const state = 'idle';
  const chainOptions = useSelector(chainsInCurrentNetworkSelector);

  return (
    <ImprobabilityComponent
      chainOptions={chainOptions}
      coins={coins}
      state={state}
    />
  );
};
