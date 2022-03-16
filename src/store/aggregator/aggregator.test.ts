import { BigNumber, constants } from 'ethers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { combineReducers, DeepPartial } from '@reduxjs/toolkit';

import { pick } from '../../utils/helpers';
import { Reducers } from '../../constants';
import { AllowTokens__factory, Bridge__factory } from '../../contracts/types';
import { rootReducer, RootState } from '..';

import { createMockedContract, mockSigner } from '../../testUtils';

import { currentChainSelector } from '../app/app.selectors';
import {
  fetchAllowTokenAddress,
  fetchBridgeFeesAndLimits,
  setFlowState,
} from './aggregator.sagas';
import { aggregatorActions } from './aggregator.slice';
import { AggregatorState } from './aggregator.state';
import {
  allowTokensContractSelector,
  bridgeContractSelector,
  destinationChainIdSelector,
  startingTokenSelector,
} from './aggregator.selectors';

const mockBridge = createMockedContract(
  Bridge__factory.connect(constants.AddressZero, mockSigner),
  true
);

const mockAllowTokens = createMockedContract(
  AllowTokens__factory.connect(constants.AddressZero, mockSigner),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('aggregator store', () => {
  // const testAccount = '0x0123';
  const allowTokensAddress = '0x01212411234';

  const reducer = combineReducers(pick(rootReducer, [Reducers.Aggregator]));

  const initialState: DeepPartial<RootState> = {
    [Reducers.Aggregator]: { ...new AggregatorState() },
  };

  describe('fetchBridgeData', () => {
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
    const testStartingChain = { id: 1 };
    const testDestinationChainId = 30;
    const testStartingToken = 'USDT';
    const testStartingTokenAddress =
      '0xdAC17F958D2ee523a2206206994597C13D831ec7';

    const bridgeFee = BigNumber.from('0x29a2241af62c0000');
    const minTransfer = BigNumber.from('0x1a055690d9db80000');
    const maxTransfer = BigNumber.from('0xd3c21bcecceda1000000');
    const dailyLimit = BigNumber.from('0x84595161401484a000000');

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
        .select(currentChainSelector)
        .select(destinationChainIdSelector)
        .select(startingTokenSelector);

    it('happy path', async () => {
      const runResult = await getBasePath()
        .provide([
          [matchers.select(allowTokensContractSelector), mockAllowTokens],
          [matchers.select(currentChainSelector), testStartingChain],
          [matchers.select(destinationChainIdSelector), testDestinationChainId],
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
          [matchers.select(currentChainSelector), testStartingChain],
          [matchers.select(destinationChainIdSelector), testDestinationChainId],
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
          [matchers.select(currentChainSelector), testStartingChain],
          [matchers.select(destinationChainIdSelector), testDestinationChainId],
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
        .select(currentChainSelector);

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
      const testCurrentChain = { id: 1 };
      const runResult = await getBasePath()
        .provide([[matchers.select(currentChainSelector), testCurrentChain]])
        .put(aggregatorActions.setFlowStateDeposit())
        .hasFinalState(depositState)
        .run();

      expect(runResult.effects).toEqual({});
    });
    it('withdraw path', async () => {
      const testCurrentChain = { id: 30 };
      const runResult = await getBasePath()
        .provide([[matchers.select(currentChainSelector), testCurrentChain]])
        .put(aggregatorActions.setFlowStateWithdraw())
        .hasFinalState(withdrawState)
        .run();

      expect(runResult.effects).toEqual({});
    });
  });
});
