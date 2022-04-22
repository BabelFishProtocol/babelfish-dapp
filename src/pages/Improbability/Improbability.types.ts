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
  coins: ImprobabilityRowData[];
  state: FiniteStates;
};

export type ImprobabilityRowData = Omit<Coin, 'addresses'>;
