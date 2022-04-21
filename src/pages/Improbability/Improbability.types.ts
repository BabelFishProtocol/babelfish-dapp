import { ChainEnum } from '../../config/chains';
import { TokenTypeBase } from '../../config/tokens';
import { FiniteStates } from '../../utils/types';

export type Coin = TokenTypeBase & {
  balance: string;
  pool: number;
  apr: number;
  earnedInKind: string;
  earnedInXusd: string;
};

export type ImprobabilityComponentProps = {
  coins: Coin[];
  state: FiniteStates;
};

export type ImprobabilityFormValues = {
  network: ChainEnum | '';
};
