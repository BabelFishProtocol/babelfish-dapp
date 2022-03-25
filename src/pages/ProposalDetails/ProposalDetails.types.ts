import { ProposalState } from '../../constants';
import { ProposalDetails } from '../../store/proposals/proposals.state';
import { FiniteStates } from '../../utils/types';

export type ProposalData = Omit<ProposalDetails, 'votes'>;

export type VoteStatus = {
  type?: 'for' | 'against';
  status: FiniteStates;
};

export type VoteButtonProps = {
  voteStatus: VoteStatus;
  proposalState?: ProposalState;
};

export type ProposalDetailsComponentProps = {
  proposal: ProposalData;
  voteStatus: VoteStatus;
  /** flag to determine whether current account is the guardian of the proposal */
  isGuardian: boolean;
  handleCancel: () => Promise<void>;
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
