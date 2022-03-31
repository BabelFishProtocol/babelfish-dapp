import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider';
import { BaseContract } from 'ethers';

export type FiniteStates = 'idle' | 'loading' | 'success' | 'failure';

type Ethereumish = ExternalProvider & {
  isNiftyWallet?: boolean;
  isLiquality?: boolean;
  autoRefreshOnNetworkChange: boolean;
};
export type WindowWithEthereum = Window & { ethereum?: Ethereumish };

export type ContractCallResult<
  Contract extends BaseContract,
  Method extends keyof Contract['functions']
> = Awaited<ReturnType<Contract['functions'][Method]>>;
