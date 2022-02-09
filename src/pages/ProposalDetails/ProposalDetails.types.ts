import { ProposalState } from '../../constants';
import { FiniteStates } from '../../utils/types';

export type ProposalData = {
  id: string;
  name: string;
  eta: number;
  endDate: string;
  endBlock: string;
  startDate: string;
  startBlock: string;
  description: string;
  proposedBy: string;
  contractAddress: string;
  functionToInvoke: string;
  state: ProposalState;
};

export type VoteStatus = {
  type?: 'for' | 'against';
  status: FiniteStates;
};

export type VoteButtonProps = {
  voteStatus: VoteStatus;
  proposalState: ProposalState;
};

export type ProposalDetailsComponentProps = VotesRatioBlockProps & {
  proposal: ProposalData;
  voteStatus: VoteStatus;
  /** flag to determine whether current account is the guardian of the proposal */
  isGuardian: boolean;
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
