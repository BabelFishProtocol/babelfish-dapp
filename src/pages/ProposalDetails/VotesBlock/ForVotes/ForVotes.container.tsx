import { useDispatch, useSelector } from 'react-redux';

import {
  proVotesSelector,
  userVoteTypeSelector,
  forVoteStatusSelector,
  proposalDetailsSelector,
} from '../../../../store/proposals/proposals.selectors';
import { proposalsActions } from '../../../../store/proposals/proposals.slice';

import { ForVotesComponent } from './ForVotes.component';

export const ForVotesContainer = () => {
  const dispatch = useDispatch();
  const proVotes = useSelector(proVotesSelector);
  const voteType = useSelector(userVoteTypeSelector);
  const voteStatus = useSelector(forVoteStatusSelector);
  const { state, data } = useSelector(proposalDetailsSelector);

  const handleCastVote = () => {
    dispatch(proposalsActions.castVote({ support: true }));
  };

  if (!data) return null;

  return (
    <ForVotesComponent
      votes={proVotes}
      state={state}
      voteType={voteType}
      voteStatus={voteStatus}
      proposalState={data.state}
      handleCastVote={handleCastVote}
      votesAmount={data.forVotesAmount}
    />
  );
};
