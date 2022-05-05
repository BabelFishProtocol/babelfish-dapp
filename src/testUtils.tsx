import { ReactNode } from 'react';
import { Contract, Signer } from 'ethers';
import { Provider } from 'react-redux';
import { Provider as MulticallProvider } from 'ethers-multicall';
import { Web3Provider } from '@ethersproject/providers';
import { GraphQLClient } from 'graphql-request';
import createMockStore from 'redux-mock-store';
import { DeepPartial } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Writeable } from './utils/types';

type MockedEstimateGasMethods<C extends Contract> = {
  [p in keyof C['estimateGas']]: jest.Mock;
};

type MockedContract<C extends Contract> = {
  [k in keyof C]: C[k] extends Function
    ? jest.Mock
    : k extends 'estimateGas'
    ? MockedEstimateGasMethods<C>
    : C[k];
};

const mockEstimateGasMethods = <C extends Contract>(
  contract: C
): MockedEstimateGasMethods<C> => {
  const estimateMethods = Object.keys(contract.estimateGas).reduce(
    (prev, curr: keyof C['estimateGas']) => {
      prev[curr] = jest.fn();

      return prev;
    },
    {} as MockedEstimateGasMethods<C>
  );

  return estimateMethods;
};

const isEstimate = <C extends Contract>(curr: keyof C): curr is 'estimateGas' =>
  curr === 'estimateGas';

export const createMockedContract = <C extends Contract, T extends boolean>(
  contract: C,
  cast: T
): T extends true ? C : MockedContract<C> => {
  const mockedContract = Object.keys(contract).reduce((prev, curr: keyof C) => {
    const currMethod = contract[curr];
    if (typeof currMethod === 'function') {
      (prev[curr] as Function) = jest.fn();

      return prev;
    }

    if (isEstimate(curr)) {
      (prev as Writeable<C>)[curr] = mockEstimateGasMethods(contract);

      return prev;
    }

    prev[curr] = currMethod;

    return prev;
  }, {} as MockedContract<C>);

  if (cast) {
    return mockedContract as C;
  }

  // @ts-expect-error
  return mockedContract;
};

export const mockProvider = new Web3Provider({
  // host: 'tets host',
  isMetaMask: true,
  isStatus: false,
  path: 'stryn',
  request: async () => {},
  send: async () => {},
  sendAsync: async () => {},
});

export const mockSigner: Signer = mockProvider.getSigner();

export const mockMulticallProvider: MulticallProvider = {
  init: jest.fn(),
  all: jest.fn(),
  getEthBalance: jest.fn(),
} as unknown as MulticallProvider;

export const mockSubgraphClient: GraphQLClient = {
  request: jest.fn(),
} as unknown as GraphQLClient;

type TestStoreProviderProps = {
  children: ReactNode;
  initialStore?: DeepPartial<RootState>;
};

export const TestStoreProvider = ({
  children,
  initialStore = {},
}: TestStoreProviderProps) => {
  const mockStore = createMockStore();

  return <Provider store={mockStore(initialStore)}>{children}</Provider>;
};

export const getMockStore = (initialStore: DeepPartial<RootState> = {}) => {
  const mockStore = createMockStore<RootState>();

  return mockStore(initialStore as RootState);
};

export const setMockDate = (timestamp?: number) => {
  const fakeTime = 1636585200; // 2021-11-11

  jest.useFakeTimers().setSystemTime(timestamp || fakeTime);
};
