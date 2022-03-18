import { constants } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { pick } from '../../utils/helpers';
import { Reducers } from '../../constants';
import {
  AllowTokens__factory,
  Bridge__factory,
  ERC20__factory,
} from '../../contracts/types';
import { rootReducer, RootState } from '..';

import { createMockedContract, mockSigner } from '../../testUtils';

import {
  fetchAllowTokenAddress,
  fetchBridgeFeesAndLimits,
  fetchStartingTokenBalance,
  setFlowState,
} from './aggregator.sagas';
import { aggregatorActions } from './aggregator.slice';
import { AggregatorState } from './aggregator.state';
import {
  allowTokensContractSelector,
  bridgeContractSelector,
  destinationChainSelector,
  erc20TokenContractSelector,
  startingChainSelector,
  startingTokenSelector,
} from './aggregator.selectors';
import { ChainEnum } from '../../config/chains';
import { accountSelector } from '../app/app.selectors';

const mockBridge = createMockedContract(
  Bridge__factory.connect(constants.AddressZero, mockSigner),
  true
);

const mockAllowTokens = createMockedContract(
  AllowTokens__factory.connect(constants.AddressZero, mockSigner),
  true
);

const mockToken = createMockedContract(
  ERC20__factory.connect(constants.AddressZero, mockSigner),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('aggregator store', () => {
  const reducer = combineReducers(pick(rootReducer, [Reducers.Aggregator]));

  const initialState: DeepPartial<RootState> = {
    [Reducers.Aggregator]: { ...new AggregatorState() },
  };

  describe('fetchBridgeData', () => {
    const allowTokensAddress = '0x10892374akb23xz0q9w8q6123dcasedq21345as0';

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        allowTokensAddress: {
          state: 'success',
          data: allowTokensAddress,
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        allowTokensAddress: {
          state: 'failure',
          data: undefined,
        },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchAllowTokenAddress)
        .withReducer(reducer)
        .withState(initialState)
        .select(bridgeContractSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(bridgeContractSelector), mockBridge],
          [matchers.call.fn(mockBridge.allowTokens), allowTokensAddress],
        ])
        .call(mockBridge.allowTokens)
        .put(aggregatorActions.setAllowTokensAddress(allowTokensAddress))
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      await getBasePath()
        .provide([[matchers.select(bridgeContractSelector), undefined]])
        .put(aggregatorActions.fetchAllowTokensAddressFailure())
        .hasFinalState(failureState)
        .run();

      expect(mockBridge.allowTokens).not.toHaveBeenCalled();
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(bridgeContractSelector), mockBridge],
          [matchers.call.fn(mockBridge.allowTokens), throwError()],
        ])
        .call(mockBridge.allowTokens)
        .put(aggregatorActions.fetchAllowTokensAddressFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('fetchBridgeFeesAndLimits', () => {
    const testStartingChain = ChainEnum.ETH;
    const testDestinationChain = ChainEnum.RSK;
    const testStartingToken = 'USDT';
    const testStartingTokenAddress =
      '0xdAC17F958D2ee523a2206206994597C13D831ec7';

    const bridgeFee = '0x29a2241af62c0000';
    const minTransfer = '0x1a055690d9db80000';
    const maxTransfer = '0xd3c21bcecceda1000000';
    const dailyLimit = '0x84595161401484a000000';

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        feesAndLimits: {
          state: 'success',
          data: {
            bridgeFee,
            minTransfer,
            maxTransfer,
            dailyLimit,
          },
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        feesAndLimits: {
          state: 'failure',
          data: {},
        },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchBridgeFeesAndLimits)
        .withReducer(reducer)
        .withState(initialState)
        .select(allowTokensContractSelector)
        .select(startingChainSelector)
        .select(destinationChainSelector)
        .select(startingTokenSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(allowTokensContractSelector), mockAllowTokens],
          [matchers.select(startingChainSelector), testStartingChain],
          [matchers.select(destinationChainSelector), testDestinationChain],
          [matchers.select(startingTokenSelector), testStartingToken],
          [matchers.call.fn(mockAllowTokens.getFeePerToken), bridgeFee],
          [matchers.call.fn(mockAllowTokens.getMinPerToken), minTransfer],
          [matchers.call.fn(mockAllowTokens.getMaxTokensAllowed), maxTransfer],
          [matchers.call.fn(mockAllowTokens.dailyLimit), dailyLimit],
        ])
        .call(mockAllowTokens.getFeePerToken, testStartingTokenAddress)
        .call(mockAllowTokens.getMinPerToken, testStartingTokenAddress)
        .call(mockAllowTokens.getMaxTokensAllowed)
        .call(mockAllowTokens.dailyLimit)
        .put(
          aggregatorActions.setFeesAndLimits({
            bridgeFee,
            minTransfer,
            maxTransfer,
            dailyLimit,
          })
        )
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });

    it('when wallet is not connected', async () => {
      await getBasePath()
        .provide([
          [matchers.select(allowTokensContractSelector), undefined],
          [matchers.select(startingChainSelector), testStartingChain],
          [matchers.select(destinationChainSelector), testDestinationChain],
          [matchers.select(startingTokenSelector), testStartingToken],
        ])
        .put(aggregatorActions.fetchFeesAndLimitsFailure())
        .hasFinalState(failureState)
        .run();

      expect(mockAllowTokens.getFeePerToken).not.toHaveBeenCalled();
    });

    it('fetching error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(allowTokensContractSelector), mockAllowTokens],
          [matchers.select(startingChainSelector), testStartingChain],
          [matchers.select(destinationChainSelector), testDestinationChain],
          [matchers.select(startingTokenSelector), testStartingToken],
          [matchers.call.fn(mockAllowTokens.getFeePerToken), throwError()],
        ])
        .call(mockAllowTokens.getFeePerToken, testStartingTokenAddress)
        .put(aggregatorActions.fetchFeesAndLimitsFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });

  describe('setFlowState', () => {
    const getBasePath = () =>
      expectSaga(setFlowState)
        .withReducer(reducer)
        .withState(initialState)
        .select(startingChainSelector);

    const withdrawState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        flowState: 'withdraw',
      },
    };

    const depositState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        flowState: 'deposit',
      },
    };

    it('deposit path', async () => {
      const testStartingChain = ChainEnum.ETH;
      const runResult = await getBasePath()
        .provide([[matchers.select(startingChainSelector), testStartingChain]])
        .put(aggregatorActions.setFlowStateDeposit())
        .hasFinalState(depositState)
        .run();

      expect(runResult.effects).toEqual({});
    });
    it('withdraw path', async () => {
      const testStartingChain = ChainEnum.RSK;
      const runResult = await getBasePath()
        .provide([[matchers.select(startingChainSelector), testStartingChain]])
        .put(aggregatorActions.setFlowStateWithdraw())
        .hasFinalState(withdrawState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
  describe('fetchStartingTokenBalance', () => {
    const testAccount = '0x0123';
    const testStartingTokenBalance = '0x232347482374623';

    const successState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        startingTokenBalance: {
          state: 'success',
          data: testStartingTokenBalance,
        },
      },
    };

    const failureState: DeepPartial<RootState> = {
      ...initialState,
      [Reducers.Aggregator]: {
        ...initialState[Reducers.Aggregator],
        startingTokenBalance: {
          state: 'failure',
          data: undefined,
        },
      },
    };

    const getBasePath = () =>
      expectSaga(fetchStartingTokenBalance)
        .withReducer(reducer)
        .withState(initialState)
        .select(accountSelector)
        .select(erc20TokenContractSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(erc20TokenContractSelector), mockToken],
          [matchers.call.fn(mockToken.balanceOf), testStartingTokenBalance],
        ])
        .call(mockToken.balanceOf, testAccount)
        .put(
          aggregatorActions.setStartingTokenBalance(testStartingTokenBalance)
        )
        .hasFinalState(successState)
        .run();

      expect(runResult.effects).toEqual({});
    });
    it('when wallet not connected', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), undefined],
          [matchers.select(erc20TokenContractSelector), mockToken],
          [matchers.call.fn(mockToken.balanceOf), testStartingTokenBalance],
        ])
        .put(aggregatorActions.fetchStartingTokenBalanceFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
    it('when call throws an error', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(accountSelector), testAccount],
          [matchers.select(erc20TokenContractSelector), mockToken],
          [matchers.call.fn(mockToken.balanceOf), throwError()],
        ])
        .call(mockToken.balanceOf, testAccount)
        .put(aggregatorActions.fetchStartingTokenBalanceFailure())
        .hasFinalState(failureState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
});