import { formatWeiAmount } from '../../../../utils/helpers';

import { VoteAgainstButton } from '../VotesBlock.voteButtons';
import { VoteActionBlock } from '../VotesBlock.voteAction';
import { VotesListComponent } from '../VotesBlock.votesList';
import { VotesBlockComponentProps } from '../VotesBlock.types';

export const AgainstVotesComponent = ({
  state,
  votes,
  voteType,
  voteStatus,
  votesAmount,
  proposalState,
  handleCastVote,
}: VotesBlockComponentProps) => (
  <div>
    <VoteActionBlock
      votesAmount={`${formatWeiAmount(votesAmount || 0)} VOTES AGAINST`}
    >
      <VoteAgainstButton
        proposalState={proposalState}
        handleCastVote={handleCastVote}
        voteStatus={{ type: voteType, status: voteStatus }}
      />
    </VoteActionBlock>

    <VotesListComponent votes={votes} state={state} type="against" />
  </div>
);
