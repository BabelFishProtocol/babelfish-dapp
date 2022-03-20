import { AddProposalFields } from '../../pages/AddProposal/AddProposal.types';
import { LoadableValue } from '../types';

export type ProposalConstants = {};

export type ProposalGovernorInput = {
  governorType: string;
};

export class ProposalState {
  proposalValues?: AddProposalFields;
  errorReason?: string;

  constants: LoadableValue<ProposalConstants> = {
    state: 'idle',
    data: {},
  };
}
