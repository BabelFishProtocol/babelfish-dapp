import { gql, GraphQLClient } from 'graphql-request';

export type StakeHistoryQueryItem = {
  id: string;
  staker: string;
  amount: string;
  lockedUntil: string;
  totalStaked: string;
  transactionHash: string;
};

export type HistoryStakesQueryParams = {
  contractAddresses: string[];
};

export type HistoryStakesListQueryResult = {
  stakeEvents: StakeHistoryQueryItem[];
};

const findHistoryStakesQuery = gql`
  query getHistoryStakes($contractAddresses: [Bytes!]!) {
    stakeEvents(where: { staker_in: $contractAddresses }) {
      id
      staker
      amount
      lockedUntil
      totalStaked
      transactionHash
    }
  }
`;

export const historyStakesQuery = (
  client: GraphQLClient,
  params: HistoryStakesQueryParams
) =>
  client.request<HistoryStakesListQueryResult, HistoryStakesQueryParams>(
    findHistoryStakesQuery,
    params
  );
