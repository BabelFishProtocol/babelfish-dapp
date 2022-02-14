export type FiniteStates = 'idle' | 'loading' | 'success' | 'failure';

export type LoadableAmount = {
  isLoading: boolean;
  amount: string;
};
