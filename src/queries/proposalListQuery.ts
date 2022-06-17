import { gql, GraphQLClient } from 'graphql-request';
import {
  IGetProposalsQuery,
  IGetProposalsQueryVariables,
  IGetUserProposalsQuery,
  IGetUserProposalsQueryVariables,
} from '../gql/graphql';

export type ProposalListQueryItem = IGetProposalsQuery['proposals'][number];
export type ProposalListQueryResult = IGetProposalsQuery;

const getProposalsQuery = gql`
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

const findUserProposalsQuery = gql`
  query getUserProposals($contractAddress: Bytes!, $proposerAddress: Bytes!) {
    proposals(
      where: { contractAddress: $contractAddress, proposer: $proposerAddress }
    ) {
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
  params: IGetProposalsQueryVariables
) =>
  client.request<IGetProposalsQuery, IGetProposalsQueryVariables>(
    getProposalsQuery,
    params
  );

export const userProposalsListQuery = (
  client: GraphQLClient,
  params: IGetUserProposalsQueryVariables
) =>
  client.request<IGetUserProposalsQuery, IGetUserProposalsQueryVariables>(
    findUserProposalsQuery,
    params
  );

export const findAllProposalsSubscription = gql`
  subscription getAllProposals {
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
