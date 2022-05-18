import { formatWeiAmount } from '../../../../utils/helpers';

import { VoteForButton } from '../VotesBlock.voteButtons';
import { VoteActionBlock } from '../VotesBlock.voteAction';
import { VotesListComponent } from '../VotesBlock.votesList';
import { VotesBlockComponentProps } from '../VotesBlock.types';
import voteForIcon from '../../../../assets/icons/vote-for.svg';

const icon = (
  <img
    style={{ height: 32, marginRight: 8 }}
    src={voteForIcon}
    alt="vote for"
  />
);

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
      icon={icon}
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
