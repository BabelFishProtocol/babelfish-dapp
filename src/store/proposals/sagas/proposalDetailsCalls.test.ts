import { ContractTransaction } from 'ethers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'redux-saga-test-plan';
import {
  EffectProviders,
  StaticProvider,
  throwError,
} from 'redux-saga-test-plan/providers';
import { TransactionReceipt } from '@ethersproject/providers';
import { GovernorAlpha__factory } from '../../../contracts/types';
import { createMockedContract, mockSigner } from '../../../testUtils';

import {
  proposalDetailsCallSelector,
  selectedProposalGovernor,
  selectedProposalIdSelector,
} from '../proposals.selectors';
import { ProposalsState } from '../proposals.state';
import { proposalsReducer } from '../proposals.slice';

import {
  cancelProposal,
  executeProposal,
  queueProposal,
} from './proposalDetailsCalls';

afterEach(() => {
  jest.clearAllMocks();
});

const initialState = { ...new ProposalsState() };

const mockGovernorContract = createMockedContract(
  GovernorAlpha__factory.connect(
    '0x0000000000000000000000000000000000000001',
    mockSigner
  ),
  false
);

describe('castVote', () => {
  const mockTx = {
    hash: '0x01',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockReceipt = {
    transactionHash: '0x01',
  } as TransactionReceipt;

  const proposalId = '123';
  const [queueStep, cancelStep, executeStep] =
    initialState.proposalDetailsCall.steps;

  const mockSelectors: (EffectProviders | StaticProvider)[] = [
    [matchers.select(selectedProposalIdSelector), proposalId],
    [matchers.select(selectedProposalGovernor), mockGovernorContract],
  ];

  describe('queue', () => {
    const getBasePath = () =>
      expectSaga(queueProposal)
        .withReducer(proposalsReducer)
        .withState(initialState)
        .select(selectedProposalIdSelector)
        .select(selectedProposalGovernor);

    it('happy path', async () => {
      const expectedState: ProposalsState = {
        ...initialState,
        proposalDetailsCall: {
          status: 'success',
          currentOperation: 'queue',
          steps: [
            {
              ...queueStep,
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
        proposalDetails: {
          ...initialState.proposalDetails,
          state: 'loading', // successful proposal queueing should trigger refetch of proposal data to reflect new changes
        },
      };

      await getBasePath()
        .provide([
          ...mockSelectors,
          [matchers.call(mockGovernorContract.queue, proposalId), mockTx],
          [matchers.call(mockTx.wait), mockReceipt],
          [matchers.select(proposalDetailsCallSelector), { status: 'success' }],
        ])
        .call(mockGovernorContract.queue, proposalId)
        .hasFinalState(expectedState)
        .run();
    });

    it('call failure', async () => {
      const errorMsg = 'test queue error';

      const expectedState: ProposalsState = {
        ...initialState,
        proposalDetailsCall: {
          status: 'failure',
          currentOperation: 'queue',
          steps: [
            {
              ...queueStep,
              error: errorMsg,
            },
          ],
        },
      };

      await getBasePath()
        .provide([
          ...mockSelectors,
          [
            matchers.call(mockGovernorContract.queue, proposalId),
            throwError(new Error(errorMsg)),
          ],
          [matchers.select(proposalDetailsCallSelector), { status: 'failure' }],
          [matchers.call(mockTx.wait), mockReceipt],
        ])
        .call(mockGovernorContract.queue, proposalId)
        .hasFinalState(expectedState)
        .run();
    });
  });

  describe('execute', () => {
    const getBasePath = () =>
      expectSaga(executeProposal)
        .withReducer(proposalsReducer)
        .withState(initialState)
        .select(selectedProposalIdSelector)
        .select(selectedProposalGovernor);

    it('happy path', async () => {
      const expectedState: ProposalsState = {
        ...initialState,
        proposalDetailsCall: {
          status: 'success',
          currentOperation: 'execute',
          steps: [
            {
              ...executeStep,
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
        proposalDetails: {
          ...initialState.proposalDetails,
          state: 'loading', // successful proposal executing should trigger refetch of proposal data to reflect new changes
        },
      };

      await getBasePath()
        .provide([
          ...mockSelectors,
          [matchers.call(mockGovernorContract.execute, proposalId), mockTx],
          [matchers.call(mockTx.wait), mockReceipt],
          [matchers.select(proposalDetailsCallSelector), { status: 'success' }],
        ])
        .call(mockGovernorContract.execute, proposalId)
        .hasFinalState(expectedState)
        .run();
    });

    it('call failure', async () => {
      const errorMsg = 'test execute error';

      const expectedState: ProposalsState = {
        ...initialState,
        proposalDetailsCall: {
          status: 'failure',
          currentOperation: 'execute',
          steps: [
            {
              ...executeStep,
              error: errorMsg,
            },
          ],
        },
      };

      await getBasePath()
        .provide([
          ...mockSelectors,
          [
            matchers.call(mockGovernorContract.execute, proposalId),
            throwError(new Error(errorMsg)),
          ],
          [matchers.select(proposalDetailsCallSelector), { status: 'failure' }],
          [matchers.call(mockTx.wait), mockReceipt],
        ])
        .call(mockGovernorContract.execute, proposalId)
        .hasFinalState(expectedState)
        .run();
    });
  });

  describe('cancel', () => {
    const getBasePath = () =>
      expectSaga(cancelProposal)
        .withReducer(proposalsReducer)
        .withState(initialState)
        .select(selectedProposalIdSelector)
        .select(selectedProposalGovernor);

    it('happy path', async () => {
      const expectedState: ProposalsState = {
        ...initialState,
        proposalDetailsCall: {
          status: 'success',
          currentOperation: 'cancel',
          steps: [
            {
              ...cancelStep,
              tx: mockTx,
              txReceipt: mockReceipt,
            },
          ],
        },
        proposalDetails: {
          ...initialState.proposalDetails,
          state: 'loading', // successful proposal canceling should trigger refetch of proposal data to reflect new changes
        },
      };

      await getBasePath()
        .provide([
          ...mockSelectors,
          [matchers.call(mockGovernorContract.cancel, proposalId), mockTx],
          [matchers.select(proposalDetailsCallSelector), { status: 'success' }],
          [matchers.call(mockTx.wait), mockReceipt],
        ])
        .call(mockGovernorContract.cancel, proposalId)
        .hasFinalState(expectedState)
        .run();
    });

    it('call failure', async () => {
      const errorMsg = 'test cancel error';

      const expectedState: ProposalsState = {
        ...initialState,
        proposalDetailsCall: {
          status: 'failure',
          currentOperation: 'cancel',
          steps: [
            {
              ...cancelStep,
              error: errorMsg,
            },
          ],
        },
      };

      await getBasePath()
        .provide([
          ...mockSelectors,
          [
            matchers.call(mockGovernorContract.cancel, proposalId),
            throwError(new Error(errorMsg)),
          ],
          [matchers.select(proposalDetailsCallSelector), { status: 'failure' }],
          [matchers.call(mockTx.wait), mockReceipt],
        ])
        .call(mockGovernorContract.cancel, proposalId)
        .hasFinalState(expectedState)
        .run();
    });
  });
});
