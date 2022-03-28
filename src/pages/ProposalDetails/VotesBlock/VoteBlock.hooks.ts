import { useSelector } from 'react-redux';

import {
  selectedProposalGovernor,
  selectedProposalIdSelector,
} from '../../../store/proposals/proposals.selectors';

import { selectorsErrors } from '../../../constants';
import { useContractCall } from '../../../hooks/useContractCall';

export const useCastVote = (support: boolean) => {
  const proposalId = useSelector(selectedProposalIdSelector);
  const governorContract = useSelector(selectedProposalGovernor);

  const castVote = async () => {
    if (!proposalId || !governorContract) {
      throw new Error(selectorsErrors.missingData);
    }

    return governorContract.castVote(proposalId, support);
  };

  const { handleSubmit: handleCastVote, ...txData } = useContractCall(castVote);

  return {
    handleCastVote,
    txData,
  };
};
