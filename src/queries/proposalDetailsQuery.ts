import { gql, GraphQLClient } from 'graphql-request';
import {
  IGetProposalsDetailsQuery,
  IGetProposalsDetailsQueryVariables,
} from '../gql/graphql';

export type ProposalDetailsQueryParams = IGetProposalsDetailsQueryVariables;

export type ProposalDetailsQueryItem =
  IGetProposalsDetailsQuery['proposals'][number];

export type ProposalDetailsQueryResult = IGetProposalsDetailsQuery;

const findProposalDetailsQuery = gql`
  query getProposalsDetails($contractAddress: Bytes!, $proposalId: BigInt!) {
    proposals(
      where: { contractAddress: $contractAddress, proposalId: $proposalId }
    ) {
      proposalId
      contractAddress
      eta
      description
      startBlock
      startDate
      endBlock
      proposer
      forVotesAmount
      againstVotesAmount
      votes {
        isPro
        votes
        txHash
        voter
      }
      actions {
        calldata
        contract
        signature
      }
    }
  }
`;

export const proposalDetailsQuery = (
  client: GraphQLClient,
  params: ProposalDetailsQueryParams
) =>
  client.request<IGetProposalsDetailsQuery, IGetProposalsDetailsQueryVariables>(
    findProposalDetailsQuery,
    params
  );
