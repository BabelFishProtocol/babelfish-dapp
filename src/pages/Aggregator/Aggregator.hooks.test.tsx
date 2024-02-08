import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { MockStoreEnhanced } from 'redux-mock-store';
import { Web3Provider } from '@ethersproject/providers';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { getStore, rootReducer } from '../../store';
import {
  useAggregatorDropdowns,
  useConnectedChain,
  useWalletAddress,
} from './Aggregator.hooks';
import { AggregatorInputs } from './Aggregator.fields';
import { ChainEnum } from '../../config/chains';
import { Reducers } from '../../constants';
import { appActions, appReducer } from '../../store/app/app.slice';
import { aggregatorReducer } from '../../store/aggregator/aggregator.slice';
import * as aggregatorSelectors from '../../store/aggregator/aggregator.selectors';
import * as appSelectors from '../../store/app/app.selectors';
import { switchConnectedChain } from '../../utils/switchConnectedChain';
import { TokenEnum } from '../../config/tokens';

type TestStoreProviderProps = {
  children: ReactNode;
};

const createMockStore = () => {
  const mockRootReducer = {
    [Reducers.Convert]: aggregatorReducer,
    [Reducers.App]: appReducer,
  };

  const store = {
    ...getStore(undefined, mockRootReducer as unknown as typeof rootReducer),
  };

  return store;
};

const createTestStoreProvider =
  (mockedStore: MockStoreEnhanced<unknown, {}>) =>
  ({ children }: TestStoreProviderProps) =>
    <Provider store={mockedStore}>{children}</Provider>;

const resetField = jest.fn();
const setValue = jest.fn();
const dispatch = jest.fn();

jest.mock('../../utils/switchConnectedChain');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => dispatch,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const mockedStore = createMockStore();
const wrapper = createTestStoreProvider(
  mockedStore as MockStoreEnhanced<unknown, {}>
);

describe('Aggregator hooks', () => {
  describe('useAggregatorDropdowns', () => {
    it('RSK -> ETH', () => {
      const startingChain = ChainEnum.RSK_TESTNET;
      const startingToken = TokenEnum.XUSD;
      const destinationChain = ChainEnum.ETH_TESTNET;
      const destinationToken = TokenEnum.DAI;

      const { result } = renderHook(
        () =>
          useAggregatorDropdowns(
            startingChain,
            destinationChain,
            startingToken,
            destinationToken,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      const pool = aggregatorSelectors.poolSelector(mockedStore.getState());
      const bassetTokens =
        pool.baseChains.find((item) => item.id === destinationChain)?.bassets ??
        [];

      expect(result.current.startingChainOptions).toBe(pool.baseChains);
      expect(result.current.startingTokenOptions).toEqual([pool.masset]);
      expect(result.current.destinationChainOptions).toEqual(pool.baseChains);
      expect(result.current.destinationTokenOptions).toEqual(bassetTokens);
    });

    it('ETH -> RSK', () => {
      const startingChain = ChainEnum.ETH_TESTNET;
      const startingToken = TokenEnum.DAI;
      const destinationChain = ChainEnum.RSK_TESTNET;
      const destinationToken = ''; // not selected - always XUSD

      const { result } = renderHook(
        () =>
          useAggregatorDropdowns(
            startingChain,
            destinationChain,
            startingToken,
            destinationToken,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      const pool = aggregatorSelectors.poolSelector(mockedStore.getState());
      const bassetTokens =
        pool.baseChains.find((item) => item.id === startingChain)?.bassets ??
        [];

      expect(result.current.startingChainOptions).toBe(pool.baseChains);
      expect(result.current.startingTokenOptions).toEqual(bassetTokens);
      expect(result.current.destinationChainOptions).toEqual(pool.baseChains);
      expect(result.current.destinationTokenOptions).toEqual([pool.masset]);
    });

    it('RSK -> RSK', () => {
      const startingChain = ChainEnum.RSK_TESTNET;
      const startingToken = TokenEnum.RDOC;
      const destinationChain = ChainEnum.RSK_TESTNET;
      const destinationToken = TokenEnum.XUSD;

      const { result } = renderHook(
        () =>
          useAggregatorDropdowns(
            startingChain,
            destinationChain,
            startingToken,
            destinationToken,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      const pool = aggregatorSelectors.poolSelector(mockedStore.getState());
      const bassetTokens =
        pool.baseChains.find((item) => item.id === destinationChain)?.bassets ??
        [];

      expect(result.current.startingChainOptions).toBe(pool.baseChains);
      expect(result.current.startingTokenOptions).toEqual([
        pool.masset,
        ...bassetTokens,
      ]);
      expect(result.current.destinationChainOptions).toEqual(pool.baseChains);
      expect(result.current.destinationTokenOptions).toEqual([
        pool.masset,
        ...bassetTokens,
      ]);
    });

    it('toggles flow when ETH -> RSK', async () => {
      const startingChain = ChainEnum.ETH_TESTNET;
      const startingToken = TokenEnum.DAI;
      const destinationChain = ChainEnum.RSK_TESTNET;
      const destinationToken = TokenEnum.XUSD;

      const { result } = renderHook(
        () =>
          useAggregatorDropdowns(
            startingChain,
            destinationChain,
            startingToken,
            destinationToken,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      const pool = aggregatorSelectors.poolSelector(mockedStore.getState());
      const bassetTokens =
        pool.baseChains.find((item) => item.id === startingChain)?.bassets ??
        [];

      expect(result.current.startingChainOptions).toBe(pool.baseChains);
      expect(result.current.startingTokenOptions).toEqual(bassetTokens);
      expect(result.current.destinationChainOptions).toEqual(pool.baseChains);
      expect(result.current.destinationTokenOptions).toEqual([pool.masset]);

      await result.current.toggleFlow();

      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.DestinationChain,
        startingChain
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingChain,
        destinationChain
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.DestinationToken,
        startingToken
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingToken,
        destinationToken
      );
    });

    it('toggles flow when RSK -> RSK', async () => {
      const startingChain = ChainEnum.RSK_TESTNET;
      const startingToken = TokenEnum.RDOC;
      const destinationChain = ChainEnum.RSK_TESTNET;
      const destinationToken = TokenEnum.XUSD;

      const { result } = renderHook(
        () =>
          useAggregatorDropdowns(
            startingChain,
            destinationChain,
            startingToken,
            destinationToken,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      const pool = aggregatorSelectors.poolSelector(mockedStore.getState());
      const bassetTokens =
        pool.baseChains.find((item) => item.id === destinationChain)?.bassets ??
        [];

      expect(result.current.startingChainOptions).toBe(pool.baseChains);
      expect(result.current.startingTokenOptions).toEqual([
        pool.masset,
        ...bassetTokens,
      ]);
      expect(result.current.destinationChainOptions).toEqual(pool.baseChains);
      expect(result.current.destinationTokenOptions).toEqual([
        pool.masset,
        ...bassetTokens,
      ]);

      await result.current.toggleFlow();

      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.DestinationChain,
        startingChain
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingChain,
        destinationChain
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.DestinationToken,
        startingToken
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingToken,
        destinationToken
      );
    });
  });

  describe('useConnectedChain', () => {
    it('connects to the startingChain', async () => {
      const connectedChain = ChainEnum.RSK_TESTNET;
      const startingChain = ChainEnum.ETH_TESTNET;
      const provider = {} as Web3Provider;

      jest
        .spyOn(appSelectors, 'providerSelector')
        .mockReturnValueOnce(provider);
      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () => useConnectedChain(startingChain, resetField, setValue),
        {
          wrapper,
        }
      );

      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingChain,
        connectedChain
      );
      expect(result.current.wrongChainConnectedError).toBe(true);
      expect(switchConnectedChain).toHaveBeenCalledWith(
        startingChain,
        provider
      );
    });

    it('uses connected chain when no starting chain', async () => {
      const connectedChain = ChainEnum.RSK_TESTNET;
      const startingChain = '';

      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () => useConnectedChain(startingChain, resetField, setValue),
        {
          wrapper,
        }
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingChain,
        connectedChain
      );
      expect(result.current.wrongChainConnectedError).toBe(true);
    });

    it('toggles pool when connected to testnet instead of mainnet', async () => {
      const connectedChain = ChainEnum.RSK;
      const startingChain = ChainEnum.RSK_TESTNET;

      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () => useConnectedChain(startingChain, resetField, setValue),
        {
          wrapper,
        }
      );

      expect(resetField).toHaveBeenCalledWith(
        AggregatorInputs.DestinationChain
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingChain,
        connectedChain
      );
      expect(result.current.wrongChainConnectedError).toBe(true);
    });

    it('toggles flow state when connected to the wrong chain in wrong pool', async () => {
      const connectedChain = ChainEnum.RSK_TESTNET;
      const startingChain = ChainEnum.ETH;

      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () => useConnectedChain(startingChain, resetField, setValue),
        {
          wrapper,
        }
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingChain,
        connectedChain
      );
      expect(result.current.wrongChainConnectedError).toBe(true);
    });
  });

  describe('useWalletAddress', () => {
    it('sets walletAddress when defined', () => {
      const walletAddress = '0x6EEA29791737779006e31b20e2910045f3e4C8CE';

      renderHook(() => useWalletAddress(setValue), {
        wrapper: createTestStoreProvider(
          mockedStore as MockStoreEnhanced<unknown, {}>
        ),
      });
      act(() => {
        mockedStore.dispatch(appActions.setAccount(walletAddress));
      });
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.ReceiveAddress,
        walletAddress
      );
    });
  });
});
