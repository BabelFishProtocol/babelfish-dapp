import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider';

export type FiniteStates = 'idle' | 'loading' | 'success' | 'failure';

type Ethereumish = ExternalProvider & {
  isNiftyWallet?: boolean;
  isLiquality?: boolean;
  autoRefreshOnNetworkChange: boolean;
};
export type WindowWithEthereum = Window & { ethereum?: Ethereumish };
