import { useDispatch, useSelector } from 'react-redux';

import {
  userVoteTypeSelector,
  againstVotesSelector,
  proposalDetailsSelector,
  againstVoteStatusSelector,
} from '../../../../store/proposals/proposals.selectors';
import { proposalsActions } from '../../../../store/proposals/proposals.slice';
import { VotesSummary } from './VotesSummary.component';

export const AgainstVotesContainer = () => {
  const dispatch = useDispatch();
  const proVotes = useSelector(againstVotesSelector);
  const voteType = useSelector(userVoteTypeSelector);
  const voteStatus = useSelector(againstVoteStatusSelector);
  const { state, data } = useSelector(proposalDetailsSelector);

  const handleCastVote = () => {
    dispatch(proposalsActions.castVote({ support: false }));
  };

  if (!data) return null;

  return (
    <VotesSummary
      type="against"
      votes={proVotes}
      state={state}
      voteType={voteType}
      voteStatus={voteStatus}
      proposalState={data.state}
      handleCastVote={handleCastVote}
      votesAmount={data.againstVotesAmount}
    />
  );
};
