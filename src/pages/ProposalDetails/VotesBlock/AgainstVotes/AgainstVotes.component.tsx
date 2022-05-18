import { formatWeiAmount } from '../../../../utils/helpers';

import { VoteAgainstButton } from '../VotesBlock.voteButtons';
import { VoteActionBlock } from '../VotesBlock.voteAction';
import { VotesListComponent } from '../VotesBlock.votesList';
import { VotesBlockComponentProps } from '../VotesBlock.types';
import voteAgainstIcon from '../../../../assets/icons/vote-against.svg';

const icon = (
  <img
    style={{ height: 32, marginRight: 8 }}
    src={voteAgainstIcon}
    alt="vote against"
  />
);

export const AgainstVotesComponent = ({
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
      icon={icon}
      votesAmount={`${formatWeiAmount(votesAmount || 0)} VOTES AGAINST`}
    >
      <VoteAgainstButton
        proposalState={proposalState}
        handleCastVote={handleCastVote}
        voteStatus={{ type: voteType, status: voteStatus }}
      />
    </VoteActionBlock>

    <VotesListComponent votes={votes} state={state} type="against" />
  </>
);
