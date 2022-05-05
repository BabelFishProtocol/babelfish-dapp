import { gql, GraphQLClient } from 'graphql-request';

export type TransactionsQueryItem = {
  asset: string;
  id: string;
  date: string;
  event: 'Deposit' | 'Withdraw';
  amount: string;
};

export type TransactionsQueryResult = {
  xusdTransactions: TransactionsQueryItem[];
};

const findTransactionsQuery = gql`
  query getTransactions {
    xusdTransactions(orderBy: date) {
      asset
      id
      date
      event
      amount
    }
  }
`;

export const transactionsQuery = (client: GraphQLClient) =>
  client.request<TransactionsQueryResult>(findTransactionsQuery);
