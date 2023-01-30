import { ContractTransaction } from 'ethers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { TransactionReceipt } from '@ethersproject/providers';
import { GovernorAlpha__factory } from '../../../contracts/types';
import { createMockedContract, mockSigner } from '../../../testUtils';

import {
  selectedProposalGovernor,
  selectedProposalIdSelector,
} from '../proposals.selectors';
import { ProposalsState } from '../proposals.state';
import { proposalsActions, proposalsReducer } from '../proposals.slice';

import { castVote } from './castVote';

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
  const mockVoteTx = {
    hash: '0x01',
    wait: jest.fn() as ContractTransaction['wait'],
  } as ContractTransaction;

  const mockVoteReceipt = {
    transactionHash: '0x01',
  } as TransactionReceipt;

  const proposalId = '123';
  const [voteForStep, voteAgainstStep] = initialState.voteCall.steps;

  it('happy path - vote for', async () => {
    const expectedState: ProposalsState = {
      ...initialState,
      voteCall: {
        status: 'success',
        currentOperation: 'vote for',
        steps: [
          {
            ...voteForStep,
            tx: mockVoteTx,
            txReceipt: mockVoteReceipt,
          },
        ],
      },
    };

    const support = true;

    await expectSaga(castVote, proposalsActions.castVote({ support }))
      .withReducer(proposalsReducer)
      .withState(initialState)
      .provide([
        [matchers.select(selectedProposalIdSelector), proposalId],
        [matchers.select(selectedProposalGovernor), mockGovernorContract],
        [matchers.call.fn(mockGovernorContract.castVote), mockVoteTx],
        [matchers.call.fn(mockVoteTx.wait), mockVoteReceipt],
      ])
      .select(selectedProposalIdSelector)
      .select(selectedProposalGovernor)
      .call(mockGovernorContract.castVote, proposalId, support)
      .hasFinalState(expectedState)
      .run();
  });

  it('happy path - vote against', async () => {
    const expectedState: ProposalsState = {
      ...initialState,
      voteCall: {
        status: 'success',
        currentOperation: 'vote against',
        steps: [
          {
            ...voteAgainstStep,
            tx: mockVoteTx,
            txReceipt: mockVoteReceipt,
          },
        ],
      },
    };

    const support = false;

    await expectSaga(castVote, proposalsActions.castVote({ support }))
      .withReducer(proposalsReducer)
      .withState(initialState)
      .provide([
        [matchers.select(selectedProposalIdSelector), proposalId],
        [matchers.select(selectedProposalGovernor), mockGovernorContract],
        [matchers.call.fn(mockGovernorContract.castVote), mockVoteTx],
        [matchers.call.fn(mockVoteTx.wait), mockVoteReceipt],
      ])
      .hasFinalState(expectedState)
      .run();
  });

  it('call failure', async () => {
    const errorMsg = 'stake tx error';

    const expectedState: ProposalsState = {
      ...initialState,
      voteCall: {
        status: 'failure',
        currentOperation: 'vote for',
        steps: [
          {
            ...voteForStep,
            error: errorMsg,
          },
        ],
      },
    };

    const support = true;

    await expectSaga(castVote, proposalsActions.castVote({ support }))
      .withReducer(proposalsReducer)
      .withState(initialState)
      .provide([
        [matchers.select(selectedProposalIdSelector), proposalId],
        [matchers.select(selectedProposalGovernor), mockGovernorContract],
        [
          matchers.call.fn(mockGovernorContract.castVote),
          throwError(new Error(errorMsg)),
        ],
      ])
      .hasFinalState(expectedState)
      .run();
  });

  it('when proposal is not selected', async () => {
    const expectedState: ProposalsState = {
      ...initialState,
      voteCall: {
        status: 'failure',
        steps: [
          {
            ...voteForStep,
            error: 'Proposal not selected',
          },
          voteAgainstStep,
        ],
      },
    };

    const support = true;

    const runResult = await expectSaga(
      castVote,
      proposalsActions.castVote({ support })
    )
      .withReducer(proposalsReducer)
      .withState(initialState)
      .provide([
        [matchers.select(selectedProposalIdSelector), undefined],
        [matchers.select(selectedProposalGovernor), mockGovernorContract],
      ])
      .select(selectedProposalIdSelector)
      .select(selectedProposalGovernor)
      .put(proposalsActions.setVoteCallError('Proposal not selected'))
      .hasFinalState(expectedState)
      .run();

    expect(runResult.effects).toEqual({});
  });
});
