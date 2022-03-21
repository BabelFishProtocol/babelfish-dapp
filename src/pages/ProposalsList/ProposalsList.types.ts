import { Proposal } from '../../store/proposals/proposals.state';
import { FiniteStates } from '../../utils/types';

export type ProposalsListComponentProps = {
  proposals: Proposal[];
  state: FiniteStates;
};
