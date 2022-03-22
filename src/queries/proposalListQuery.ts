import { gql, GraphQLClient } from 'graphql-request';

type ProposalListQueryParams = { contractAddress: string };

export type ProposalListQueryItem = {
  proposalId: string;
  description: string;
  startDate: string;
  endBlock: string;
  startBlock: string;
  contractAddress: string;
};

export type ProposalListQueryResult = {
  proposals: ProposalListQueryItem[];
};

const findProposalsQuery = gql`
  query getProposals($contractAddress: Bytes!) {
    proposals(where: { contractAddress: $contractAddress }) {
      description
      startDate
      startBlock
      endBlock
      proposalId
      contractAddress
    }
  }
`;

export const proposalsListQuery = (
  client: GraphQLClient,
  params: ProposalListQueryParams
) =>
  client.request<ProposalListQueryResult, ProposalListQueryParams>(
    findProposalsQuery,
    params
  );
