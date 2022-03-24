import { GovernorTypes, ProposalState } from '../../constants';
import { ProposalListQueryItem } from '../../queries/proposalListQuery';
import { getFutureTimestamp } from '../../utils/helpers';

import { Proposal } from './proposals.state';

export const parseProposal = (
  proposal: ProposalListQueryItem,
  proposalState: ProposalState,
  governorsAddresses: Record<GovernorTypes, string>
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

  const governorName = Object.keys(governorsAddresses).find(
    (type) =>
      governorsAddresses[type as GovernorTypes].toLowerCase() ===
      contractAddress.toLowerCase()
  );

  return {
    endBlock,
    endTime,
    startBlock,
    startTime,
    id: proposalId,
    contractAddress,
    state: proposalState,
    governorType: governorName as GovernorTypes,
    title: `${proposalId.padStart(3, '0')} • ${description}`,
  };
};

export const parseProposals = (
  proposals: ProposalListQueryItem[],
  proposalsStates: number[],
  governorsAddresses: Record<GovernorTypes, string>
) => {
  const parsedProposals = proposals.map((proposal, index) =>
    parseProposal(
      proposal,
      proposalsStates[index] as unknown as ProposalState,
      governorsAddresses
    )
  );

  return parsedProposals;
};
