import { ProposalState } from '../../../constants';
import { Vote } from '../../../store/proposals/proposals.state';
import { VoteType } from '../../../store/proposals/proposals.types';
import { FiniteStates } from '../../../utils/types';

export type VoteStatus = {
  type?: 'for' | 'against';
  status: FiniteStates;
};

export type VoteButtonProps = {
  type: 'for' | 'against';
  voteStatus: VoteStatus;
  proposalState?: ProposalState;
  handleCastVote: () => void;
};

export type VotesListComponentProps = {
  votes: Vote[];
  type: 'for' | 'against';
  state: FiniteStates;
};

export type TableIconProps = {
  children: React.ReactNode;
};

export type VotesBlockComponentProps = Pick<
  VoteButtonProps,
  'handleCastVote' | 'proposalState'
> &
  VotesListComponentProps & {
    votesAmount: string;
    voteType: VoteType;
    voteStatus: FiniteStates;
  };

export type VoteActionBlockProps = {
  icon?: JSX.Element;
  children: React.ReactNode;
  votesAmount: string;
};
