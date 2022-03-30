import { renderHook, act } from '@testing-library/react-hooks';
import { GovernorAlpha__factory } from '../../../contracts/types';
import {
  createMockedContract,
  getMockStore,
  mockSigner,
  TestStoreProvider,
} from '../../../testUtils';
import {
  selectedProposalGovernor,
  selectedProposalIdSelector,
} from '../../../store/proposals/proposals.selectors';

import { useCastVote } from './VoteBlock.hooks';

jest.mock('../../../store/proposals/proposals.selectors', () => {
  const mockGovernorContract = createMockedContract(
    GovernorAlpha__factory.connect('0x123', mockSigner),
    false
  );

  const mockProposalId = '123';

  return {
    ...jest.requireActual('../../../store/proposals/proposals.selectors'),
    selectedProposalGovernor: jest.fn().mockReturnValue(mockGovernorContract),
    selectedProposalIdSelector: jest.fn().mockReturnValue(mockProposalId),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCastVote', () => {
  it('calls contract method with proper arguments', async () => {
    const mockStore = getMockStore();

    const mockGovernorContract = selectedProposalGovernor(mockStore.getState());
    const mockProposalId = selectedProposalIdSelector(mockStore.getState());

    const support = true;
    const { result } = renderHook(() => useCastVote(support), {
      wrapper: TestStoreProvider,
    });

    expect(result.current.txData.status).toBe('idle');

    await act(async () => result.current.handleCastVote());

    expect(mockGovernorContract?.castVote).toHaveBeenCalledWith(
      mockProposalId,
      support
    );

    expect(result.current.txData.status).toBe('success');
  });
});
