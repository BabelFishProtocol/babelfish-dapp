import { gql, GraphQLClient } from 'graphql-request';

export type Stake = {
  id: string;
  staker: string;
  amount: string;
  lockedUntil: string;
  totalStaked: string;
  transactionHash: string;
  blockTimeStamp: string;
};

export type HistoryStakesQueryParams = {
  contractAddresses: string[];
};

export type HistoryStakesListQueryResult = {
  stakeEvents: Stake[];
};

const stakeFragment = `
    id
    staker
    amount
    lockedUntil
    totalStaked
    transactionHash
    blockTimeStamp
`;

const findHistoryStakesQuery = gql`
  query getHistoryStakes($contractAddresses: [Bytes!]!) {
    stakeEvents(where: { staker_in: $contractAddresses }) {
      ${stakeFragment}
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

type VestingContract = {
  id: string;
  owner: string;
  address: string;
  stakes: Stake[];
};

type UserData = {
  id: string;
  address: string;
  stakes: Stake[];
  vests: VestingContract[];
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
      address
      stakes {
        ${stakeFragment}
      }
      vests {
        id
        owner
        address
        stakes {
          ${stakeFragment}
        }
      }
    }
  }
`;

export const userQuery = (client: GraphQLClient, params: UserQueryParams) =>
  client.request<UserQueryResult, UserQueryParams>(findUserQuery, params);
