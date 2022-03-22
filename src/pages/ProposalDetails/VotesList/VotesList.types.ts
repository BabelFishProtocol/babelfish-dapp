import { Vote } from '../../../store/proposals/proposals.state';
import { FiniteStates } from '../../../utils/types';

export type VotesListComponentProps = {
  votes: Vote[];
  type: 'for' | 'against';
  state: FiniteStates;
};

export type TableIconProps = {
  children: React.ReactNode;
};
