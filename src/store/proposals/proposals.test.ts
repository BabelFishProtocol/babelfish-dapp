import { utils } from 'ethers';
import { DeepPartial } from '@reduxjs/toolkit';

import { ProposalDetails, ProposalsState, Vote } from './proposals.state';
import {
  isGuardianSelector,
  userVoteTypeSelector,
  votesRatioSelector,
} from './proposals.selectors';

afterEach(() => {
  jest.clearAllMocks();
});

describe('proposals store', () => {
  describe('selectors', () => {
    describe('votesRatioSelector', () => {
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

        expect(winningProposalRatio?.toFixed(2)).toBe('89.99');

        const beatenProposal: DeepPartial<ProposalDetails> = {
          forVotesAmount: '550000',
          againstVotesAmount: '3567800',
        };

        const beatenProposalRatio = votesRatioSelector.resultFunc(true, {
          state: 'success',
          data: beatenProposal as ProposalDetails,
        });

        expect(beatenProposalRatio?.toFixed(2)).toBe('13.36');
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

        expect(winningProposalRatio?.toFixed(2)).toBe('66.67');

        const beatenProposal: DeepPartial<ProposalDetails> = {
          forVotesAmount: utils.parseEther('500').toString(),
          againstVotesAmount: utils.parseEther('1500').toString(),
        };

        const beatenProposalRatio = votesRatioSelector.resultFunc(true, {
          state: 'success',
          data: beatenProposal as ProposalDetails,
        });

        expect(beatenProposalRatio?.toFixed(2)).toBe('25.00');
      });
    });

    describe('userVoteTypeSelector', () => {
      const userAccount = '0x01';

      it('when user has a vote supporting the proposal', () => {
        const proVotes: Partial<Vote>[] = [
          { isPro: true, voter: '0x123' },
          { isPro: true, voter: userAccount },
        ];

        const againstVotes: Partial<Vote>[] = [
          { isPro: false, voter: '0x234' },
        ];

        const voteType = userVoteTypeSelector.resultFunc(
          proVotes as Vote[],
          againstVotes as Vote[],
          userAccount
        );

        expect(voteType).toBe('for');
      });

      it('when user has a vote against the proposal', () => {
        const proVotes: Partial<Vote>[] = [{ isPro: true, voter: '0x123' }];

        const againstVotes: Partial<Vote>[] = [
          { isPro: false, voter: '0x234' },
          { isPro: false, voter: userAccount },
        ];

        const voteType = userVoteTypeSelector.resultFunc(
          proVotes as Vote[],
          againstVotes as Vote[],
          userAccount
        );

        expect(voteType).toBe('against');
      });

      it(`when user doesn't have any votes`, () => {
        const proVotes: Partial<Vote>[] = [
          { isPro: true, voter: '0x123' },
          { isPro: true, voter: '0x1234' },
        ];

        const againstVotes: Partial<Vote>[] = [
          { isPro: false, voter: '0x234' },
          { isPro: false, voter: '0x2345' },
        ];

        const voteType = userVoteTypeSelector.resultFunc(
          proVotes as Vote[],
          againstVotes as Vote[],
          userAccount
        );

        expect(voteType).toBe(undefined);
      });
    });

    describe('isGuardianSelector', () => {
      const userAccount = '0x01A';

      it('when user is the guardian', () => {
        const testProposal: Partial<ProposalDetails> = {
          guardian: userAccount.toLowerCase(),
        };

        const result = isGuardianSelector.resultFunc(
          { state: 'success', data: testProposal as ProposalDetails },
          userAccount
        );

        expect(result).toBe(true);
      });

      it('when user is not the guardian', () => {
        const testProposal: Partial<ProposalDetails> = {
          guardian: '0x32324',
        };

        const result = isGuardianSelector.resultFunc(
          { state: 'success', data: testProposal as ProposalDetails },
          userAccount
        );

        expect(result).toBe(false);
      });

      it('when data is not present', () => {
        const emptyProposalData: ProposalsState['proposalDetails'] = {
          state: 'failure',
          data: undefined,
        };

        const result = isGuardianSelector.resultFunc(
          emptyProposalData,
          userAccount
        );

        expect(result).toBe(undefined);
      });
    });
  });
});
