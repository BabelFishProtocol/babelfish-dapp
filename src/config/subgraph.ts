import { SubscriptionClient } from 'subscription-client';
import { GraphQLClient } from 'graphql-request';
import { ChainEnum } from './chains';

export const subgraphClients: Partial<Record<ChainEnum, GraphQLClient>> = {
  [ChainEnum.RSK_TESTNET]: new GraphQLClient(
    'http://https://babelfish-subgraph.test.sovryn.app/subgraphs/name/babelfish/rskTestnet-graph'
  ),
  [ChainEnum.RSK]: new GraphQLClient(
    'http://https://babelfish-subgraph.sovryn.app/subgraphs/name/babelfish/rsk-graph'
  ),
};

export const subgraphWsClients: Partial<Record<ChainEnum, SubscriptionClient>> =
  {
    [ChainEnum.RSK_TESTNET]: new SubscriptionClient(
      'ws://babelfish-subgraph.test.sovryn.app:8001/subgraphs/name/babelfish/rskTestnet-graph',
      {
        reconnect: true,
      }
    ),
    [ChainEnum.RSK]: new SubscriptionClient(
      'ws://babelfish-subgraph.sovryn.app:7001/subgraphs/name/babelfish/rsk-graph',
      {
        reconnect: true,
      }
    ),
  };
