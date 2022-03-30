import { gql, GraphQLClient } from 'graphql-request';

export type StakeHistoryQueryItem = {
  id: string;
  staker: string;
  amount: string;
  lockedUntil: string;
  totalStaked: string;
  transactionHash: string;
};

export type HistoryStakesListQueryResult = {
  stakeEvents: StakeHistoryQueryItem[];
};

const findHistoryStakesQuery = gql`
  query getHistoryStakes {
    stakeEvents {
      id
      staker
      amount
      lockedUntil
      totalStaked
      transactionHash
    }
  }
`;

export const historyStakesQuery = (client: GraphQLClient) =>
  client.request<HistoryStakesListQueryResult>(findHistoryStakesQuery);
