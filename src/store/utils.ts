import { call, select } from 'typed-redux-saga';
import { BaseContract } from 'ethers';
import { ParamType } from 'ethers/lib/utils';
import { Web3Provider } from '@ethersproject/providers';
import { Provider, setMulticallAddress, ContractCall } from 'ethers-multicall';
import {
  chainIdSelector,
  multicallSelector,
  providerSelector,
} from './app/app.selectors';

export const getMulticallProvider = async (
  provider: Web3Provider,
  chainId: number,
  multicallAddress: string
) => {
  setMulticallAddress(chainId, multicallAddress);
  const multicallProvider = new Provider(provider, chainId);

  await multicallProvider.init();

  return multicallProvider;
};

export const convertForMulticall = <
  Contract extends BaseContract,
  Method extends keyof Contract['functions']
>(
  contract: Contract,
  method: Method,
  fullMethodName: keyof Contract['interface']['functions'],
  ...args: Parameters<Contract['functions'][Method]>
) => {
  const funcData = contract.interface.functions[
    fullMethodName as string
  ] as Omit<ContractCall, 'params' | 'contract'>;

  const contractCall: ContractCall = {
    ...funcData,
    contract: {
      address: contract.address,
    },
    params: args as ParamType[],
  };

  return contractCall;
};

export function* getMulticallSaga() {
  const chainId = yield* select(chainIdSelector);
  const provider = yield* select(providerSelector);
  const multicall = yield* select(multicallSelector);

  if (!provider || !chainId || !multicall) {
    throw new Error('Wallet not connected');
  }

  const multicallProvider = yield* call(
    getMulticallProvider,
    provider,
    chainId,
    multicall.address
  );

  return multicallProvider;
}
