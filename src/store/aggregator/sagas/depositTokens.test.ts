import { ContractTransaction, utils } from 'ethers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'redux-saga-test-plan';
import {
  EffectProviders,
  StaticProvider,
} from 'redux-saga-test-plan/providers';
import { TransactionReceipt } from '@ethersproject/providers';

import { parseUnits } from 'ethers/lib/utils';

import {
  accountSelector,
  massetContractSelector,
} from '../../app/app.selectors';
import { aggregatorActions, aggregatorReducer } from '../aggregator.slice';

import { AggregatorState } from '../aggregator.state';
import {
  depositMockValues,
  depositRSKMockValues,
  getAggregatorInitialState,
  getTxDetails,
  mockAccount,
  mockAmount,
  mockBridge,
  mockMasset,
  mockMassetAddress,
  mockReceiver,
  mockToken,
  mockTokenAddress,
  mockTokenDecimals,
} from '../aggregator.mock';
import {
  bridgeContractSelector,
  massetAddressSelector,
  startingTokenAddressSelector,
  startingTokenContractSelector,
  startingTokenDecimalsSelector,
} from '../aggregator.selectors';
import { depositTokens } from './depositTokens';

afterEach(() => {
  jest.clearAllMocks();
});

describe('depositTokens', () => {
  const mockTx = {
    hash: '0x01',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockReceipt = {
    transactionHash: '0x01',
  } as TransactionReceipt;

  describe('through bridge', () => {
    const txDetails = getTxDetails({
      isCrossChain: 'true',
      event: 'Deposit',
    });

    const aggregatorInitialState = getAggregatorInitialState(txDetails);
    const initialSteps = aggregatorInitialState.submitCall?.steps;

    const extraData = utils.defaultAbiCoder.encode(['address'], [mockReceiver]);
    const mockSelectors: (EffectProviders | StaticProvider)[] = [
      [matchers.select(bridgeContractSelector), mockBridge],
      [matchers.select(massetContractSelector), mockMasset],
      [matchers.select(startingTokenAddressSelector), mockTokenAddress],
      [matchers.select(startingTokenDecimalsSelector), mockTokenDecimals],
      [matchers.select(startingTokenContractSelector), mockToken],
      [matchers.select(massetAddressSelector), mockMassetAddress],
      [matchers.select(accountSelector), mockAccount],
    ];

    it('when sufficient allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'deposit',
          steps: [
            {
              ...initialSteps?.[2],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        depositTokens,
        aggregatorActions.submit(depositMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('11')],
          [matchers.call.fn(mockBridge.receiveTokensAt), mockTx],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(
          mockToken.allowance,
          mockAccount.toLowerCase(),
          mockBridge.address
        )
        .call(
          mockBridge.receiveTokensAt,
          mockTokenAddress,
          mockAmount,
          mockMassetAddress,
          extraData
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when unsufficient(non-zero) allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'deposit',
          steps: [
            {
              ...initialSteps?.[0],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
            {
              ...initialSteps?.[1],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
            {
              ...initialSteps?.[2],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        depositTokens,
        aggregatorActions.submit(depositMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('5')],
          [matchers.call.fn(mockToken.approve), mockTx],
          [matchers.call.fn(mockBridge.receiveTokensAt), mockTx],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(
          mockToken.allowance,
          mockAccount.toLowerCase(),
          mockBridge.address
        )
        .call(mockToken.approve, mockBridge.address.toLowerCase(), 0)
        .call(mockToken.approve, mockBridge.address.toLowerCase(), mockAmount)
        .call(
          mockBridge.receiveTokensAt,
          mockTokenAddress,
          mockAmount,
          mockMassetAddress,
          extraData
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when zero allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'deposit',
          steps: [
            {
              ...initialSteps?.[1],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
            {
              ...initialSteps?.[2],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        depositTokens,
        aggregatorActions.submit(depositMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('0')],
          [matchers.call.fn(mockToken.approve), mockTx],
          [matchers.call.fn(mockBridge.receiveTokensAt), mockTx],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(
          mockToken.allowance,
          mockAccount.toLowerCase(),
          mockBridge.address
        )
        .call(mockToken.approve, mockBridge.address.toLowerCase(), mockAmount)
        .call(
          mockBridge.receiveTokensAt,
          mockTokenAddress,
          mockAmount,
          mockMassetAddress,
          extraData
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when no address provided', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'failure',
          steps: [
            {
              ...initialSteps?.[0],
              error: 'Could not find addresses',
            },
            ...initialSteps.slice(1, 4),
          ],
        },
      };

      await expectSaga(
        depositTokens,
        aggregatorActions.submit(depositMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors.slice(0, -1),
          [matchers.select(accountSelector), undefined],
        ])
        .put(aggregatorActions.setSubmitError('Could not find addresses'))
        .hasFinalState(expectedState)
        .run();
    });
  });

  describe('on RSK only', () => {
    const mockSelectors: (EffectProviders | StaticProvider)[] = [
      [matchers.select(bridgeContractSelector), undefined],
      [matchers.select(massetContractSelector), mockMasset],
      [matchers.select(startingTokenAddressSelector), mockTokenAddress],
      [matchers.select(startingTokenDecimalsSelector), mockTokenDecimals],
      [matchers.select(startingTokenContractSelector), mockToken],
      [matchers.select(massetAddressSelector), mockMassetAddress],
      [matchers.select(accountSelector), mockAccount],
    ];

    const txDetails = getTxDetails({
      isCrossChain: undefined,
      event: 'Deposit',
    });
    const aggregatorInitialState = getAggregatorInitialState(txDetails);
    const initialSteps = aggregatorInitialState.submitCall?.steps;

    it('when sufficient allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'deposit',
          steps: [
            {
              ...initialSteps?.[2],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        depositTokens,
        aggregatorActions.submit(depositRSKMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('11')],
          [matchers.call.fn(mockMasset.mintTo), mockTx],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(mockToken.allowance, mockAccount.toLowerCase(), mockMassetAddress)
        .call(
          mockMasset.mintTo,
          mockTokenAddress,
          mockAmount,
          mockReceiver.toLowerCase()
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when unsufficient(non-zero) allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'deposit',
          steps: [
            {
              ...initialSteps?.[0],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
            {
              ...initialSteps?.[1],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
            {
              ...initialSteps?.[2],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        depositTokens,
        aggregatorActions.submit(depositRSKMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('5')],
          [matchers.call.fn(mockToken.approve), mockTx],
          [matchers.call.fn(mockMasset.mintTo), mockTx],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(mockToken.allowance, mockAccount.toLowerCase(), mockMassetAddress)
        .call(mockToken.approve, mockMassetAddress.toLowerCase(), 0)
        .call(mockToken.approve, mockMassetAddress.toLowerCase(), mockAmount)
        .call(
          mockMasset.mintTo,
          mockTokenAddress,
          mockAmount,
          mockReceiver.toLowerCase()
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when zero allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'deposit',
          steps: [
            {
              ...initialSteps?.[1],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
            {
              ...initialSteps?.[2],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        depositTokens,
        aggregatorActions.submit(depositRSKMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('0')],
          [matchers.call.fn(mockToken.approve), mockTx],
          [matchers.call.fn(mockMasset.mintTo), mockTx],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(mockToken.allowance, mockAccount.toLowerCase(), mockMassetAddress)
        .call(mockToken.approve, mockMassetAddress.toLowerCase(), mockAmount)
        .call(
          mockMasset.mintTo,
          mockTokenAddress,
          mockAmount,
          mockReceiver.toLowerCase()
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when no address provided', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'failure',
          steps: [
            {
              ...initialSteps?.[0],
              error: 'Could not find addresses',
            },
            ...initialSteps.slice(1, 4),
          ],
        },
      };

      await expectSaga(
        depositTokens,
        aggregatorActions.submit(depositRSKMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors.slice(0, -1),
          [matchers.select(accountSelector), undefined],
        ])
        .put(aggregatorActions.setSubmitError('Could not find addresses'))
        .hasFinalState(expectedState)
        .run();
    });
  });
});
