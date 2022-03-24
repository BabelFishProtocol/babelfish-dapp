import { utils } from 'ethers';
import { DeepPartial } from '@reduxjs/toolkit';

import { ProposalDetails } from './proposals.state';
import { votesRatioSelector } from './proposals.selectors';

afterEach(() => {
  jest.clearAllMocks();
});

describe('proposals store', () => {
  describe('proposal selectors', () => {
    it('returns undefined when there is no data', () => {
      const emptyDataResult = votesRatioSelector.resultFunc(true, {
        state: 'failure',
        data: undefined,
      });

      expect(emptyDataResult).toBeUndefined();

      const noVotesProposal: DeepPartial<ProposalDetails> = {
        votes: [],
        forVotesAmount: '0',
        againstVotesAmount: '0',
      };

      const noVotesResult = votesRatioSelector.resultFunc(false, {
        state: 'success',
        data: noVotesProposal as ProposalDetails,
      });

      expect(noVotesResult).toBeUndefined();
    });

    it('returns 100 when there are no against proposals', () => {
      const proposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: '10',
        againstVotesAmount: '0',
      };

      const result = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: proposal as ProposalDetails,
      });

      expect(result).toBe(100);
    });

    it('properly calculates ratio', () => {
      const winningProposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: '9999900',
        againstVotesAmount: '1112200',
      };

      const winningProposalRatio = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: winningProposal as ProposalDetails,
      });

      expect(winningProposalRatio.toFixed(2)).toBe('89.99');

      const beatenProposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: '550000',
        againstVotesAmount: '3567800',
      };

      const beatenProposalRatio = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: beatenProposal as ProposalDetails,
      });

      expect(beatenProposalRatio.toFixed(2)).toBe('13.36');
    });

    it('works fine with big numbers', () => {
      const winningProposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: utils.parseEther('100000.5').toString(),
        againstVotesAmount: utils.parseEther('50000.5').toString(),
      };

      const winningProposalRatio = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: winningProposal as ProposalDetails,
      });

      expect(winningProposalRatio.toFixed(2)).toBe('66.67');

      const beatenProposal: DeepPartial<ProposalDetails> = {
        forVotesAmount: utils.parseEther('500').toString(),
        againstVotesAmount: utils.parseEther('1500').toString(),
      };

      const beatenProposalRatio = votesRatioSelector.resultFunc(true, {
        state: 'success',
        data: beatenProposal as ProposalDetails,
      });

      expect(beatenProposalRatio.toFixed(2)).toBe('25.00');
    });
  });
});
