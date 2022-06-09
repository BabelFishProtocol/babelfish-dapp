import { gql, GraphQLClient } from 'graphql-request';

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
  client.request<ProposalDetailsQueryResult, ProposalDetailsQueryParams>(
    findProposalDetailsQuery,
    params
  );
