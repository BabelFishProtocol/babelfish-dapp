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
import {
  aggregatorActions,
  aggregatorReducer,
} from '../../store/aggregator/aggregator.slice';
import * as aggregatorSelectors from '../../store/aggregator/aggregator.selectors';
import * as appSelectors from '../../store/app/app.selectors';
import { switchConnectedChain } from '../../utils/switchConnectedChain';

type TestStoreProviderProps = {
  children: ReactNode;
};

const createMockStore = () => {
  const mockRootReducer = {
    [Reducers.Aggregator]: aggregatorReducer,
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

const testSequence = (func: jest.Mock, ...args: AggregatorInputs[]) => {
  args.forEach((inputType: AggregatorInputs, i) =>
    expect(func).toHaveBeenNthCalledWith(i + 1, inputType)
  );
};

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
    it('switches when deposit', () => {
      const startingChain = ChainEnum.RSK;
      const destinationChain = '';

      const { result } = renderHook(
        () =>
          useAggregatorDropdowns(
            startingChain,
            destinationChain,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      const pool = aggregatorSelectors.poolSelector(mockedStore.getState());

      testSequence(
        resetField,
        AggregatorInputs.StartingToken,
        AggregatorInputs.DestinationChain,
        AggregatorInputs.DestinationToken
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingChain,
        destinationChain
      );
      expect(result.current.startingChainOptions).toBe(pool.baseChains);
      expect(result.current.startingTokenOptions).toEqual([]);
      expect(result.current.destinationChainOptions).toEqual([
        pool.masterChain,
      ]);
      expect(result.current.destinationTokenOptions).toEqual([pool.masset]);
    });

    it('switches when withdraw', () => {
      const startingChain = '';
      const destinationChain = ChainEnum.RSK;

      jest
        .spyOn(aggregatorSelectors, 'flowStateSelector')
        .mockReturnValueOnce('withdraw');

      const { result } = renderHook(
        () =>
          useAggregatorDropdowns(
            startingChain,
            destinationChain,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      const pool = aggregatorSelectors.poolSelector(mockedStore.getState());

      testSequence(
        resetField,
        AggregatorInputs.DestinationChain,
        AggregatorInputs.DestinationToken,
        AggregatorInputs.StartingChain,
        AggregatorInputs.StartingToken
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.DestinationChain,
        startingChain
      );
      expect(result.current.destinationChainOptions).toBe(pool.baseChains);
      expect(result.current.destinationTokenOptions).toEqual([]);
      expect(result.current.startingChainOptions).toEqual([pool.masterChain]);
      expect(result.current.startingTokenOptions).toEqual([pool.masset]);
    });

    it('resets form when connected to the unsupported chain', () => {
      const startingChain = '';
      const destinationChain = ChainEnum.RSK;
      const connectedChain = 46;

      jest
        .spyOn(aggregatorSelectors, 'flowStateSelector')
        .mockReturnValueOnce('withdraw');
      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () =>
          useAggregatorDropdowns(
            startingChain,
            destinationChain,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      testSequence(
        resetField,
        AggregatorInputs.StartingChain,
        AggregatorInputs.StartingToken,
        AggregatorInputs.DestinationChain,
        AggregatorInputs.DestinationToken
      );
      expect(result.current.destinationChainOptions).toEqual([]);
      expect(result.current.destinationTokenOptions).toEqual([]);
      expect(result.current.startingChainOptions).toEqual([]);
      expect(result.current.startingTokenOptions).toEqual([]);
    });
  });

  describe('useConnectedChain', () => {
    it('switches connected chain to startingChain', async () => {
      const connectedChain = ChainEnum.BSC;
      const startingChain = ChainEnum.ETH;
      const destinationChain = ChainEnum.RSK;
      const provider = {} as Web3Provider;

      jest
        .spyOn(appSelectors, 'providerSelector')
        .mockReturnValueOnce({} as Web3Provider);
      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () =>
          useConnectedChain(
            startingChain,
            destinationChain,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      expect(result.current.hideDestinationTokenDropdown).toBe(true);
      expect(result.current.wrongChainConnectedError).toBe(true);
      expect(switchConnectedChain).toHaveBeenCalledWith(
        startingChain,
        provider
      );
    });

    it("resets fields when pool doesn't have chain", async () => {
      const connectedChain = ChainEnum.BSC;
      const startingChain = ChainEnum.ETH;
      const destinationChain = ChainEnum.RSK;

      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () =>
          useConnectedChain(
            startingChain,
            destinationChain,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );

      testSequence(
        resetField,
        AggregatorInputs.StartingChain,
        AggregatorInputs.StartingToken,
        AggregatorInputs.DestinationChain,
        AggregatorInputs.DestinationToken
      );
      expect(dispatch).toBeCalledWith(
        aggregatorActions.setStartingToken(undefined)
      );
      expect(dispatch).toBeCalledWith(
        aggregatorActions.setDestinationChain(undefined)
      );
      expect(dispatch).toBeCalledWith(
        aggregatorActions.setDestinationToken(undefined)
      );
      expect(dispatch).toBeCalledWith(aggregatorActions.togglePool());
      expect(result.current.hideDestinationTokenDropdown).toBe(true);
      expect(result.current.wrongChainConnectedError).toBe(true);
      expect(result.current.hideDestinationTokenDropdown).toBe(true);
      expect(result.current.wrongChainConnectedError).toBe(true);
    });

    it('toggles flow state when connected destination chain', async () => {
      const connectedChain = ChainEnum.RSK_TESTNET;
      const startingChain = ChainEnum.ETH;
      const destinationChain = ChainEnum.RSK_TESTNET;

      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () =>
          useConnectedChain(
            startingChain,
            destinationChain,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );
      expect(dispatch).toHaveBeenCalledWith(
        aggregatorActions.toggleFlowState()
      );
      expect(result.current.hideDestinationTokenDropdown).toBe(true);
      expect(result.current.wrongChainConnectedError).toBe(true);
    });

    it('toggles flow state when connected test chain', async () => {
      const connectedChain = ChainEnum.ETH_TESTNET;
      const startingChain = ChainEnum.RSK_TESTNET;
      const destinationChain = ChainEnum.RSK_TESTNET;

      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () =>
          useConnectedChain(
            startingChain,
            destinationChain,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.DestinationChain,
        connectedChain
      );
      expect(dispatch).toHaveBeenCalledWith(
        aggregatorActions.toggleFlowState()
      );
      expect(result.current.hideDestinationTokenDropdown).toBe(false);
      expect(result.current.wrongChainConnectedError).toBe(true);
    });

    it('toggles flow state when connected to the wrong chain', async () => {
      const connectedChain = ChainEnum.BSC_TESTNET;
      const startingChain = ChainEnum.ETH;
      const destinationChain = ChainEnum.RSK;

      jest
        .spyOn(appSelectors, 'chainIdSelector')
        .mockReturnValueOnce(connectedChain);

      const { result } = renderHook(
        () =>
          useConnectedChain(
            startingChain,
            destinationChain,
            resetField,
            setValue
          ),
        {
          wrapper,
        }
      );
      expect(setValue).toHaveBeenCalledWith(
        AggregatorInputs.StartingChain,
        connectedChain
      );
      expect(result.current.hideDestinationTokenDropdown).toBe(true);
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
