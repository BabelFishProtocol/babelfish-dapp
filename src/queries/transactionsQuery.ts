import { gql, GraphQLClient } from 'graphql-request';
import {
  IGetTransactionsQuery,
  IGetTransactionsQueryVariables,
  IXusdTransaction,
} from '../gql/graphql';

export type TransactionsQueryItem = IXusdTransaction;

export const getTransactionsDocument = gql`
  query getTransactions($user: Bytes!) {
    xusdTransactions(orderBy: date, where: { user: $user }) {
      id
      event
      txHash
      date
      asset
      amount
      user
    }
  }
`;

export const transactionsQuery = async (
  client: GraphQLClient,
  params: IGetTransactionsQueryVariables
) =>
  client.request<IGetTransactionsQuery, IGetTransactionsQueryVariables>(
    getTransactionsDocument,
    params
  );
