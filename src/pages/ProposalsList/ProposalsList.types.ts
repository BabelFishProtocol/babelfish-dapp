import { FiniteStates } from '../../utils/types';

export type Proposal = {
  name: string;
  startBlock: number;
  voteVeight: 'Active' | 'Executed' | 'Queued' | 'Pending';
  endDate: string;
  isWinning: string;
  id: string;
};

export type ProposalsListComponentProps = {
  proposals: Proposal[];
  state: FiniteStates;
};
