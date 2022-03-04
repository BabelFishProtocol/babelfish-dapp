import { ProposalState } from '../../constants';
import { LoadableValue } from '../types';

export type Proposal = {
  id: string;
  proposer: string;
  eta: number;
  startBlock: number;
  endBlock: number;
  startTime: number;
  endTime: number;
  forVotes: string;
  againstVotes: string;
  quorum: string;
  canceled: boolean;
  executed: boolean;
  state: ProposalState;
};

export class ProposalsState {
  proposalsList: LoadableValue<Proposal[]> = {
    state: 'idle',
    data: [],
  };
}
