import { LoadableValue } from '../types';

export type Proposal = {
  id: number;
  proposer: string;
  eta: number;
  startBlock: number;
  endBlock: number;
  startTime: number;
  forVotes: string;
  againstVotes: string;
  quorum: string;
  canceled: boolean;
  executed: boolean;
};

export class ProposalsState {
  proposalsList: LoadableValue<Proposal[]> = {
    state: 'idle',
    data: [],
  };
}
