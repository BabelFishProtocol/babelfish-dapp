import { ProposalState } from '../../constants';
import { ProposalListQueryItem } from '../../queries/proposalListQuery';
import { getFutureTimestamp } from '../../utils/helpers';

import { Proposal } from './proposals.state';

export const parseProposal = (
  proposal: ProposalListQueryItem,
  proposalState: ProposalState
): Proposal => {
  const { proposalId, description, contractAddress } = proposal;

  const startTime = Number(proposal.startDate);
  const startBlock = Number(proposal.startBlock);
  const endBlock = Number(proposal.endBlock);

  const endTime = getFutureTimestamp(
    Number(startTime),
    Number(startBlock),
    Number(endBlock),
    30
  );

  return {
    endBlock,
    endTime,
    startBlock,
    startTime,
    id: proposalId,
    contractAddress,
    state: proposalState,
    title: `${proposalId.padStart(3, '0')} • ${description}`,
  };
};

export const parseProposals = (
  proposals: ProposalListQueryItem[],
  proposalsStates: number[]
): Proposal[] => {
  const parsedProposals: Proposal[] = proposals.map((proposal, index) =>
    parseProposal(proposal, proposalsStates[index] as unknown as ProposalState)
  );

  return parsedProposals;
};
