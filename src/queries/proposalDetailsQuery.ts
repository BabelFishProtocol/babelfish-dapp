import { gql } from 'graphql-request';

export type ProposalDetailsQueryParams = {
  contractAddress: string;
  proposalId: string;
};

export type ProposalDetailsQueryItem = {
  proposalId: string;
  description: string;
  startDate: string;
  eta: string;
  endBlock: string;
  startBlock: string;
  contractAddress: string;
  forVotesAmount: string;
  againstVotesAmount: string;
  proposer: string;
  votes: {
    isPro: boolean;
    votes: string;
    txHash: string;
    voter: string;
  }[];
  actions: {
    calldata: string;
    contract: string;
    signature: string;
  }[];
};

export type ProposalDetailsQueryResult = {
  proposals: ProposalDetailsQueryItem[];
};

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
