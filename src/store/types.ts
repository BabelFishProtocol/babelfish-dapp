import { FiniteStates } from '../utils/types';

export type LoadableValue<Data> = {
  data: Data;
  state: FiniteStates;
};
