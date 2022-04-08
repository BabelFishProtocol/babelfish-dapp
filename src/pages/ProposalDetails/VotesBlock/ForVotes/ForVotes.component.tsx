import { formatWeiAmount } from '../../../../utils/helpers';

import { VoteForButton } from '../VotesBlock.voteButtons';
import { VoteActionBlock } from '../VotesBlock.voteAction';
import { VotesListComponent } from '../VotesBlock.votesList';
import { VotesBlockComponentProps } from '../VotesBlock.types';

export const ForVotesComponent = ({
  state,
  votes,
  voteType,
  voteStatus,
  votesAmount,
  proposalState,
  handleCastVote,
}: VotesBlockComponentProps) => (
  <>
    <VoteActionBlock
      votesAmount={`${formatWeiAmount(votesAmount || 0)} VOTES FOR`}
    >
      <VoteForButton
        proposalState={proposalState}
        handleCastVote={handleCastVote}
        voteStatus={{ type: voteType, status: voteStatus }}
      />
    </VoteActionBlock>

    <VotesListComponent votes={votes} state={state} type="for" />
  </>
);
