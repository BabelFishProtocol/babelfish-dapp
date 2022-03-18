import { GraphQLClient } from 'graphql-request';
import { ChainEnum } from './chains';

export const subgraphClients: Partial<Record<ChainEnum, GraphQLClient>> = {
  [ChainEnum.RSK_TESTNET]: new GraphQLClient(
    'http://3.72.58.184:8000/subgraphs/name/babelfish/graph'
  ),
  [ChainEnum.RSK]: new GraphQLClient(
    'http://3.72.58.184:7000/subgraphs/name/babelfish/graph'
  ),
};
