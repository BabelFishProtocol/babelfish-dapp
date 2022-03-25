import { GovernorTypes, ProposalState } from '../../constants';
import { FiniteStates } from '../../utils/types';
import { LoadableValue } from '../types';

export type ProposalUrlParams = Pick<Proposal, 'id' | 'governorType'>;

export type Proposal = {
  id: string;
  startBlock: number;
  endBlock: number;
  startTime: number;
  endTime: number;
  state: ProposalState;
  title: string;
  contractAddress: string;
  governorType: GovernorTypes;
};

export type Vote = {
  voter: string;
  txHash: string;
  votes: string;
  isPro: boolean;
};

export type ProposalAction = {
  contract: string;
  signature: string;
  calldata: string;
};

export type ProposalDetails = Proposal & {
  forVotesAmount: string;
  againstVotesAmount: string;
  votes: Vote[];
  eta: string;
  proposer: string;
  description: string;
  actions: ProposalAction[];
  guardian: string;
};

export class ProposalsState {
  addProposalErrorReason?: string;
  addProposalState: FiniteStates = 'idle';

  proposalsList: LoadableValue<Proposal[]> = {
    state: 'idle',
    data: [],
  };
  proposalDetails: LoadableValue<ProposalDetails | undefined> = {
    state: 'idle',
    data: undefined,
  };
  selectedProposal?: ProposalUrlParams;
}
