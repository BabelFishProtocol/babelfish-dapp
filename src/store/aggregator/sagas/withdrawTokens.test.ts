import { ContractTransaction } from 'ethers';
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
  mockAccount,
  mockAmount,
  mockBassetAddress,
  mockDestinationTokenAddress,
  mockMasset,
  mockReceiver,
  mockToken,
  mockTokenDecimals,
  withdrawMockValues,
  withdrawRSKMockValues,
} from '../aggregator.mock';
import {
  bassetAddressSelector,
  destinationTokenAddressSelector,
  startingTokenContractSelector,
  startingTokenDecimalsSelector,
} from '../aggregator.selectors';
import { withdrawTokens } from './withdrawTokens';
import { getAggregatorInitialState, getTxDetails } from './utils';

afterEach(() => {
  jest.clearAllMocks();
});

describe('withdrawTokens', () => {
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
      event: 'Withdraw',
    });

    const aggregatorInitialState = getAggregatorInitialState(txDetails);
    const initialSteps = aggregatorInitialState.submitCall?.steps;

    const mockSelectors: (EffectProviders | StaticProvider)[] = [
      [matchers.select(startingTokenDecimalsSelector), mockTokenDecimals],
      [matchers.select(startingTokenContractSelector), mockToken],
      [
        matchers.select(destinationTokenAddressSelector),
        mockDestinationTokenAddress,
      ],
      [matchers.select(bassetAddressSelector), mockBassetAddress],
      [matchers.select(accountSelector), mockAccount],
      [matchers.select(massetContractSelector), mockMasset],
    ];

    it('when sufficient allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'withdraw',
          steps: [
            {
              ...initialSteps?.[3],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        withdrawTokens,
        aggregatorActions.submit(withdrawMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('11')],
          [
            matchers.call.fn(
              mockMasset['redeemToBridge(address,uint256,address)']
            ),
            mockTx,
          ],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(
          mockToken.allowance,
          mockAccount,
          mockMasset.address.toLowerCase()
        )
        .call(
          mockMasset['redeemToBridge(address,uint256,address)'],
          mockBassetAddress,
          mockAmount,
          mockReceiver.toLowerCase()
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when unsufficient allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'withdraw',
          steps: [
            {
              ...initialSteps?.[1],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
            {
              ...initialSteps?.[3],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        withdrawTokens,
        aggregatorActions.submit(withdrawMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('4')],
          [matchers.call.fn(mockToken.approve), mockTx],
          [
            matchers.call.fn(
              mockMasset['redeemToBridge(address,uint256,address)']
            ),
            mockTx,
          ],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(
          mockToken.allowance,
          mockAccount,
          mockMasset.address.toLowerCase()
        )
        .call(mockToken.approve, mockMasset.address.toLowerCase(), mockAmount)
        .call(
          mockMasset['redeemToBridge(address,uint256,address)'],
          mockBassetAddress,
          mockAmount,
          mockReceiver.toLowerCase()
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when no masset contract', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'failure',
          steps: [
            {
              ...initialSteps?.[0],
              error: 'Could not find contracts',
            },
            ...initialSteps.slice(1, 4),
          ],
        },
      };

      await expectSaga(
        withdrawTokens,
        aggregatorActions.submit(withdrawMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors.slice(0, -1),
          [matchers.select(massetContractSelector), undefined],
        ])
        .put(aggregatorActions.setSubmitError('Could not find contracts'))
        .hasFinalState(expectedState)
        .run();
    });
  });

  describe('on RSK only', () => {
    const txDetails = getTxDetails({
      isCrossChain: undefined,
      event: 'Withdraw'
    });

    const aggregatorInitialState = getAggregatorInitialState(txDetails);
    const initialSteps = aggregatorInitialState.submitCall?.steps;

    const mockSelectors: (EffectProviders | StaticProvider)[] = [
      [matchers.select(startingTokenDecimalsSelector), mockTokenDecimals],
      [matchers.select(startingTokenContractSelector), mockToken],
      [
        matchers.select(destinationTokenAddressSelector),
        mockDestinationTokenAddress,
      ],
      [matchers.select(bassetAddressSelector), undefined],
      [matchers.select(accountSelector), mockAccount],
      [matchers.select(massetContractSelector), mockMasset],
    ];

    it('when sufficient allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'withdraw',
          steps: [
            {
              ...initialSteps?.[3],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        withdrawTokens,
        aggregatorActions.submit(withdrawRSKMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('11')],
          [matchers.call.fn(mockMasset.redeemTo), mockTx],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(
          mockToken.allowance,
          mockAccount,
          mockMasset.address.toLowerCase()
        )
        .call(
          mockMasset.redeemTo,
          mockDestinationTokenAddress,
          mockAmount,
          mockReceiver.toLowerCase()
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when unsufficient allowance', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'success',
          currentOperation: 'withdraw',
          steps: [
            {
              ...initialSteps?.[1],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
            {
              ...initialSteps?.[3],
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
      };

      await expectSaga(
        withdrawTokens,
        aggregatorActions.submit(withdrawRSKMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors,
          [matchers.call.fn(mockToken.allowance), parseUnits('4')],
          [matchers.call.fn(mockToken.approve), mockTx],
          [matchers.call.fn(mockMasset.redeemTo), mockTx],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .call(
          mockToken.allowance,
          mockAccount,
          mockMasset.address.toLowerCase()
        )
        .call(mockToken.approve, mockMasset.address.toLowerCase(), mockAmount)
        .call(
          mockMasset.redeemTo,
          mockDestinationTokenAddress,
          mockAmount,
          mockReceiver.toLowerCase()
        )
        .hasFinalState(expectedState)
        .run();
    });

    it('when no masset contract', async () => {
      const expectedState: AggregatorState = {
        ...aggregatorInitialState,
        submitCall: {
          status: 'failure',
          steps: [
            {
              ...initialSteps?.[0],
              error: 'Could not find contracts',
            },
            ...initialSteps.slice(1, 4),
          ],
        },
      };

      await expectSaga(
        withdrawTokens,
        aggregatorActions.submit(withdrawRSKMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors.slice(0, -1),
          [matchers.select(massetContractSelector), undefined],
        ])
        .put(aggregatorActions.setSubmitError('Could not find contracts'))
        .hasFinalState(expectedState)
        .run();
    });
  });
});
