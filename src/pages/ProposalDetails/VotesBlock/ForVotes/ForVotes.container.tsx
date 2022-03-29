import { useSelector } from 'react-redux';

import { SubmitStatusDialog } from '../../../../components/TxDialog/TxDialog.component';
import {
  proVotesSelector,
  userVoteTypeSelector,
  proposalDetailsSelector,
} from '../../../../store/proposals/proposals.selectors';

import { useCastVote } from '../VoteBlock.hooks';
import { ForVotesComponent } from './ForVotes.component';

export const ForVotesContainer = () => {
  const proVotes = useSelector(proVotesSelector);
  const voteType = useSelector(userVoteTypeSelector);
  const { state, data } = useSelector(proposalDetailsSelector);
  const { handleCastVote, txData } = useCastVote(true);

  if (!data) return null;

  return (
    <>
      <ForVotesComponent
        votes={proVotes}
        state={state}
        voteType={voteType}
        voteStatus={txData.status}
        proposalState={data.state}
        handleCastVote={handleCastVote}
        votesAmount={data.forVotesAmount}
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
