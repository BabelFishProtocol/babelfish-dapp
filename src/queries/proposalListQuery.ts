import { gql, GraphQLClient } from 'graphql-request';

export type ProposalListQueryParams = { contractAddress: string };
type UserProposalListQueryParams = ProposalListQueryParams & {
  proposerAddress: string;
};

export type ProposalListQueryItem = {
  proposalId: string;
  description: string;
  startDate: string;
  endBlock: string;
  startBlock: string;
  createdAt: string;
  contractAddress: string;
};

export type ProposalListQueryResult = {
  proposals: ProposalListQueryItem[];
};

const findProposalsQuery = gql`
  query getProposals($contractAddress: Bytes!) {
    proposals(where: { contractAddress: $contractAddress }) {
      createdAt
      description
      startDate
      startBlock
      endBlock
      proposalId
      contractAddress
    }
  }
`;

export const findAllProposalsSubscription = gql`
  subscription getProposals {
    proposals(orderBy: createdAt, orderDirection: desc) {
      createdAt
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

const findUserProposalsQuery = gql`
  query getProposals($contractAddress: Bytes!, $proposerAddress: Bytes!) {
    proposals(
      where: { contractAddress: $contractAddress, proposer: $proposerAddress }
    ) {
      description
      startDate
      startBlock
      endBlock
      proposalId
      contractAddress
    }
  }
`;

export const userProposalsListQuery = (
  client: GraphQLClient,
  params: UserProposalListQueryParams
) =>
  client.request<ProposalListQueryResult, UserProposalListQueryParams>(
    findUserProposalsQuery,
    params
  );
