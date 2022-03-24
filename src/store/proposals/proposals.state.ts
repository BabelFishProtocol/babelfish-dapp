import { ProposalState } from '../../constants';
import { FiniteStates } from '../../utils/types';
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
  addProposalErrorReason?: string;
  addProposalState: FiniteStates = 'idle';

  proposalsList: LoadableValue<Proposal[]> = {
    state: 'idle',
    data: [],
  };
}
