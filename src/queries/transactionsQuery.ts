import { GraphQLClient } from 'graphql-request';
import {
  getSdk,
  IGetTransactionsQueryVariables,
  IXusdTransaction,
} from '../generated/graphql';

export type TransactionsQueryItem = IXusdTransaction;

export const transactionsQuery = async (
  client: GraphQLClient,
  params: IGetTransactionsQueryVariables
) => {
  const sdk = getSdk(client);
  const transactions = await sdk.getTransactions({ user: params.user });
  return transactions;
};

// export type TransactionsQueryItem = {
//   asset: string;
//   id: string;
//   date: string;
//   event: 'Deposit' | 'Withdraw';
//   amount: string;
//   user: string;
// };
