import { ReactNode } from 'react';
import { Contract, Signer } from 'ethers';
import { Provider } from 'react-redux';
import { Provider as MulticallProvider } from 'ethers-multicall';
import { Web3Provider } from '@ethersproject/providers';
import { GraphQLClient } from 'graphql-request';
import createMockStore from 'redux-mock-store';
import { DeepPartial } from '@reduxjs/toolkit';
import { RootState } from './store';

type MockedContract<C extends Contract> = {
  [k in keyof C]: C[k] extends Function ? jest.Mock : C[k];
};

export const createMockedContract = <C extends Contract, T extends boolean>(
  contract: C,
  cast: T
): T extends true ? C : MockedContract<C> => {
  const mockedContract = Object.keys(contract).reduce((prev, curr: keyof C) => {
    const currMethod = contract[curr];
    if (typeof currMethod === 'function') {
      // @ts-expect-error
      prev[curr] = jest.fn();
    } else {
      prev[curr] = currMethod;
    }

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
