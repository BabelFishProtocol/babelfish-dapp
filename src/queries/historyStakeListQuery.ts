import { gql, GraphQLClient } from 'graphql-request';
import { IGetUserQuery, IGetUserQueryVariables, IUser } from '../gql/graphql';

type UserData = Pick<IUser, 'id' | 'allStakes'>;

export type UserQueryResult = {
  user: UserData;
};

const findUserQuery = gql`
  query getUser($contractAddress: ID!) {
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
  params: IGetUserQueryVariables
) =>
  client.request<IGetUserQuery, IGetUserQueryVariables>(findUserQuery, params);

export const findStakingHistorySubscription = gql`
  subscription stakingHistory($contractAddress: ID!) {
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
