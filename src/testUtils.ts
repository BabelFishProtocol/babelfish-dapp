import { Web3Provider } from '@ethersproject/providers';
import { Contract, Signer } from 'ethers';

type MockedContract<C extends Contract> = {
  [k in keyof C]: C[k] extends Function ? jest.Mock : C[k];
};

export const createMockedContract = <C extends Contract>(
  contract: C,
  cast: true | false
): typeof cast extends true ? C : MockedContract<C> => {
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
  return mockedContract;
};

export const mockprovider = new Web3Provider({
  // host: 'tets host',
  isMetaMask: true,
  isStatus: false,
  path: 'stryn',
  request: async () => {},
  send: async () => {},
  sendAsync: async () => {},
});

export const mockSigner: Signer = mockprovider.getSigner();
