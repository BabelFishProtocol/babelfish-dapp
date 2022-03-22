import { useSelector } from 'react-redux';
import {
  againstVotesSelector,
  proposalDetailsStateSelector,
  proVotesSelector,
} from '../../../store/proposals/proposals.selectors';
import { VotesListComponent } from './VotesList.component';

export const AgainstVotesListContainer = () => {
  const againstVotes = useSelector(againstVotesSelector);
  const state = useSelector(proposalDetailsStateSelector);

  return (
    <VotesListComponent votes={againstVotes} state={state} type="against" />
  );
};

export const ForVotesListContainer = () => {
  const proVotes = useSelector(proVotesSelector);
  const state = useSelector(proposalDetailsStateSelector);

  return <VotesListComponent votes={proVotes} state={state} type="for" />;
};
