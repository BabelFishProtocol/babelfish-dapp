import {
  GOVERNANCE_OPTIONS,
  GovernorTypes,
  ProposalState,
} from '../../constants';
import { FiniteStates } from '../../utils/types';
import { CallState, LoadableValue } from '../types';

export type VoteCall = 'vote for' | 'vote against';
export type ProposalDetailsCalls = 'queue' | 'cancel' | 'execute';
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
  reasonToBlockProposal?: string;
  selectedGovernor: string = GOVERNANCE_OPTIONS.GOVERNOR_ADMIN.id;
  addProposalState: FiniteStates = 'idle';

  voteCall: CallState<VoteCall> = {
    status: 'idle',
    steps: [
      { name: 'vote for', label: 'voting' },
      { name: 'vote against', label: 'voting' },
    ],
  };

  proposalDetailsCall: CallState<ProposalDetailsCalls> = {
    status: 'idle',
    steps: [
      { name: 'queue', label: 'queue proposal' },
      { name: 'cancel', label: 'canceling proposal' },
      { name: 'execute', label: 'executing proposal' },
    ],
  };

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
