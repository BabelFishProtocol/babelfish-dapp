import {
  ExternalProvider,
  Web3Provider,
} from '@ethersproject/providers/lib/web3-provider';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { BaseContract } from 'ethers';
import { ChainEnum } from '../config/chains';

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

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

type ErrorWithCode = {
  code: number;
};
export const isErrorWithCode = (error: unknown): error is ErrorWithCode =>
  (error as ErrorWithCode).code !== undefined;

export const isPortis = (
  connector?: AbstractConnector | PortisConnector
): connector is PortisConnector =>
  (connector as PortisConnector).portis !== undefined;

export type SwitchConnectedChainProps = {
  chain: ChainEnum;
  provider?: Web3Provider;
  connector?: AbstractConnector | PortisConnector;
};
