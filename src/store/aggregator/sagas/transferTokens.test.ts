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

import { transferTokens } from './transferTokens';
import { AggregatorState } from '../aggregator.state';
import {
  depositMockValues,
  mockAccount,
  mockAmount,
  mockBassetAddress,
  mockBridge,
  mockMasset,
  mockMassetAddress,
  mockReceiver,
  mockToken,
  mockTokenAddress,
  mockTokenDecimals,
  withdrawMockValues,
} from '../aggregator.mock';
import {
  bassetAddressSelector,
  bridgeContractSelector,
  flowStateSelector,
  massetAddressSelector,
  startingTokenAddressSelector,
  startingTokenContractSelector,
  startingTokenDecimalsSelector,
} from '../aggregator.selectors';

const aggregatorInitialState: AggregatorState = {
  ...new AggregatorState(),
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('transferTokens', () => {
  const mockTx = {
    hash: '0x01',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockReceipt = {
    transactionHash: '0x01',
  } as TransactionReceipt;

  const initialSteps = aggregatorInitialState?.submitCall?.steps;

  describe('deposit', () => {
    const extraData = utils.defaultAbiCoder.encode(['address'], [mockReceiver]);
    const mockSelectors: (EffectProviders | StaticProvider)[] = [
      [matchers.select(flowStateSelector), 'deposit'],
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
        transferTokens,
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
        transferTokens,
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
        transferTokens,
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
        transferTokens,
        aggregatorActions.submit(depositMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors.slice(0, -1),
          [matchers.select(accountSelector), undefined],
          [matchers.call.fn(mockToken.allowance), parseUnits('15')],
          [matchers.call.fn(mockToken.approve), mockTx],
          [matchers.call.fn(mockBridge.receiveTokensAt), mockTx],
          [matchers.call.fn(mockTx.wait), mockReceipt],
        ])
        .put(aggregatorActions.setSubmitError('Could not find addresses'))
        .hasFinalState(expectedState)
        .run();
    });
  });

  describe('withdraw', () => {
    const mockSelectors: (EffectProviders | StaticProvider)[] = [
      [matchers.select(flowStateSelector), 'withdraw'],
      [matchers.select(startingTokenDecimalsSelector), mockTokenDecimals],
      [matchers.select(startingTokenContractSelector), mockToken],
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
        transferTokens,
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
          mockReceiver
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
        transferTokens,
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
          mockReceiver
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
        transferTokens,
        aggregatorActions.submit(withdrawMockValues)
      )
        .withReducer(aggregatorReducer)
        .withState(aggregatorInitialState)
        .provide([
          ...mockSelectors.slice(0, -1),
          [matchers.select(massetContractSelector), undefined],
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
        .put(aggregatorActions.setSubmitError('Could not find contracts'))
        .hasFinalState(expectedState)
        .run();
    });
  });
});
