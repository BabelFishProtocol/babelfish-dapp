import { GraphQLClient } from 'graphql-request';
import { ChainEnum } from './chains';

export const subgraphClients: Partial<Record<ChainEnum, GraphQLClient>> = {
  [ChainEnum.RSK_TESTNET]: new GraphQLClient(
    // 'http://3.72.58.184:8000/subgraphs/name/babelfish/rskTestnet-graph'
    'http://127.0.0.1:8000/subgraphs/name/babelfish/rskTestnet-graph'
  ),
  [ChainEnum.RSK]: new GraphQLClient(
    'http://3.72.58.184:7000/subgraphs/name/babelfish/rsk-graph'
  ),
};
