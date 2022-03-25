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

type ProposalCall = () => Promise<void>;

export type ProposalDetailsComponentProps = Record<
  'handleCancel' | 'handleQueue' | 'handleExecute',
  ProposalCall
> & {
  proposal: ProposalData;
  voteStatus: VoteStatus;
  /** flag to determine whether current account is the guardian of the proposal */
  isGuardian: boolean;
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
