import { gql, GraphQLClient } from 'graphql-request';

type TransactionsQueryParams = { user: string };

export type TransactionsQueryItem = {
  asset: string;
  id: string;
  date: string;
  event: 'Deposit' | 'Withdraw';
  amount: string;
  user: string;
};

export type TransactionsQueryResult = {
  xusdTransactions: TransactionsQueryItem[];
};

const findTransactionsQuery = gql`
  query getTransactions($user: Bytes!) {
    xusdTransactions(orderBy: date, where: { user: $user }) {
      id
      event
      date
      asset
      amount
      user
    }
  }
`;

export const transactionsQuery = (
  client: GraphQLClient,
  params: TransactionsQueryParams
) =>
  client.request<TransactionsQueryResult, TransactionsQueryParams>(
    findTransactionsQuery,
    params
  );
