import { gql } from 'graphql-request';
import {
  IProposalDetailsSubscription,
  IProposalDetailsSubscriptionVariables,
} from '../gql/graphql';

export type ProposalDetailsQueryParams = IProposalDetailsSubscriptionVariables;

export type ProposalDetailsQueryItem =
  IProposalDetailsSubscription['proposals'][number];

export type ProposalDetailsQueryResult = IProposalDetailsSubscription;

export const proposalDetailsSubscription = gql`
  subscription proposalDetails($contractAddress: Bytes!, $proposalId: BigInt!) {
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
