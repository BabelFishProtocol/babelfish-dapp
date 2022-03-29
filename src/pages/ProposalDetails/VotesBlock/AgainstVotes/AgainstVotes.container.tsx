import { useSelector } from 'react-redux';

import {
  userVoteTypeSelector,
  proposalDetailsSelector,
  againstVotesSelector,
} from '../../../../store/proposals/proposals.selectors';
import { SubmitStatusDialog } from '../../../../components/TxDialog/TxDialog.component';

import { useCastVote } from '../VoteBlock.hooks';
import { AgainstVotesComponent } from './AgainstVotes.component';

export const AgainstVotesContainer = () => {
  const proVotes = useSelector(againstVotesSelector);
  const voteType = useSelector(userVoteTypeSelector);
  const { state, data } = useSelector(proposalDetailsSelector);
  const { handleCastVote, txData } = useCastVote(false);

  if (!data) return null;

  return (
    <>
      <AgainstVotesComponent
        votes={proVotes}
        state={state}
        voteType={voteType}
        voteStatus={txData.status}
        proposalState={data.state}
        handleCastVote={handleCastVote}
        votesAmount={data.againstVotesAmount}
      />

      {txData.status !== 'idle' && (
        <SubmitStatusDialog
          operationName="Voting"
          successCallback={txData.onClose}
          {...txData}
        />
      )}
    </>
  );
};
