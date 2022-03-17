import { GraphQLClient } from 'graphql-request';
import { ChainEnum } from './chains';

export const subgraphClients: Partial<Record<ChainEnum, GraphQLClient>> = {
  // [ChainEnum.RSK_TESTNET]: {
  //   chainId: ChainEnum.RSK_TESTNET,
  //   http: 'http://127.0.0.1:8000/subgraphs/name/babelfish/graph',
  //   ws: 'http://127.0.0.1:8001/subgraphs/name/babelfish/graph',
  // },
  [ChainEnum.RSK_TESTNET]: new GraphQLClient(
    'http://127.0.0.1:8000/subgraphs/name/babelfish/graph'
  ),
  [ChainEnum.RSK]: new GraphQLClient(
    'http://127.0.0.1:8000/subgraphs/name/babelfish/graph'
  ),
};
