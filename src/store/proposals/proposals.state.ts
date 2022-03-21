import { ProposalState } from '../../constants';
import { LoadableValue } from '../types';

export type Proposal = {
  id: string;
  startBlock: number;
  endBlock: number;
  startTime: number;
  endTime: number;
  state: ProposalState;
  title: string;
};

export class ProposalsState {
  proposalsList: LoadableValue<Proposal[]> = {
    state: 'idle',
    data: [],
  };
}
