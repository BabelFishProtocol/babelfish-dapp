import { FiniteStates } from '../../utils/types';

export type ProposalData = {
  id: string;
  name: string;
  endDate: string;
  endBlock: string;
  startDate: string;
  startBlock: string;
  description: string;
  proposedBy: string;
  contractAddress: string;
  functionToInvoke: string;
};

export type VoteStatus = {
  type?: 'for' | 'against';
  status: FiniteStates;
};

export type VoteButtonProps = {
  voteStatus: VoteStatus;
};

export type ProposalDetailsComponentProps = VotesRatioBlockProps & {
  proposal: ProposalData;
  voteStatus: VoteStatus;
};

export type VotesRatioBlockProps = {
  /** percentage of pro votes */
  votesRatio: number;
  forVotes: string;
  againstVotes: string;
};

export type ProposalInfoItemProps = {
  label: string;
  width?: number;
  children: React.ReactNode;
};

export type VoteActionBlockProps = {
  children: React.ReactNode;
  votesAmount: string;
};
