import { SubscriptionClient } from 'subscription-client';
import { GraphQLClient } from 'graphql-request';
import { ChainEnum } from './chains';

export const subgraphClients: Partial<Record<ChainEnum, GraphQLClient>> = {
  [ChainEnum.RSK_TESTNET]: new GraphQLClient(
    'http://3.72.58.184:8000/subgraphs/name/babelfish/rskTestnet-graph'
  ),
  [ChainEnum.RSK]: new GraphQLClient(
    'http://3.72.58.184:7000/subgraphs/name/babelfish/rsk-graph'
  ),
};

export const subgraphWsClients: Partial<Record<ChainEnum, SubscriptionClient>> =
  {
    [ChainEnum.RSK_TESTNET]: new SubscriptionClient(
      'ws://localhost:8001/subgraphs/name/babelfish/rskTestnet-graph',
      {
        reconnect: true,
      }
    ),
    [ChainEnum.RSK]: new SubscriptionClient(
      'ws://3.72.58.184:7001/subgraphs/name/babelfish/rsk-graph',
      {
        reconnect: true,
      }
    ),
  };
