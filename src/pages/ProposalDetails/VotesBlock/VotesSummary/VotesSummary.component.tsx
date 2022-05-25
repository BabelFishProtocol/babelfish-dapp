import { formatWeiAmount } from '../../../../utils/helpers';

import { VoteButton } from '../VotesBlock.voteButtons';
import { VoteActionBlock } from '../VotesBlock.voteAction';
import { VotesListComponent } from '../VotesBlock.votesList';
import { VotesBlockComponentProps } from '../VotesBlock.types';
import voteAgainstIcon from '../../../../assets/icons/vote-against.svg';
import voteForIcon from '../../../../assets/icons/vote-for.svg';

const againstIcon = (
  <img
    style={{ height: 32, marginRight: 8 }}
    src={voteAgainstIcon}
    alt="vote against"
  />
);

const forIcon = (
  <img
    style={{ height: 32, marginRight: 8 }}
    src={voteForIcon}
    alt="vote for"
  />
);

export const VotesSummary = ({
  type,
  state,
  votes,
  voteType,
  voteStatus,
  votesAmount,
  proposalState,
  handleCastVote,
}: VotesBlockComponentProps) => {
  const icon = type === 'for' ? forIcon : againstIcon;

  return (
    <>
      <VoteActionBlock
        icon={icon}
        votesAmount={`${formatWeiAmount(
          votesAmount || 0
        )} VOTES ${type.toUpperCase()}`}
      >
        <VoteButton
          type={type}
          proposalState={proposalState}
          handleCastVote={handleCastVote}
          voteStatus={{ type: voteType, status: voteStatus }}
        />
      </VoteActionBlock>

      <VotesListComponent votes={votes} state={state} type={type} />
    </>
  );
};
