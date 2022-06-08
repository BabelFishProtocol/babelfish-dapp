import { gql, GraphQLClient } from 'graphql-request';

export type Stake = {
  id: string;
  staker: string;
  amount: string;
  lockedUntil: string;
  totalStaked: string;
  transactionHash: string;
  blockTimestamp: string;
};

type UserData = {
  id: string;
  allStakes: Stake[];
};

export type UserQueryParams = {
  contractAddress: string;
};

export type UserQueryResult = {
  user: UserData;
};

const findUserQuery = gql`
  query getUser($contractAddress: Bytes!) {
    user(id: $contractAddress) {
      id
      allStakes(orderBy: blockTimestamp, orderDirection: desc) {
        id
        staker
        amount
        lockedUntil
        totalStaked
        transactionHash
        blockTimestamp
      }
    }
  }
`;

export const findStakingHistorySubscription = gql`
  subscription stakingHistory($contractAddress: Bytes!) {
    user(id: $contractAddress) {
      id
      allStakes(orderBy: blockTimestamp, orderDirection: desc) {
        id
        staker
        amount
        lockedUntil
        totalStaked
        transactionHash
        blockTimestamp
      }
    }
  }
`;

export const allUserStakesQuery = (
  client: GraphQLClient,
  params: UserQueryParams
) => client.request<UserQueryResult, UserQueryParams>(findUserQuery, params);
