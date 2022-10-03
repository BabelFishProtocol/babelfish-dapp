import { SubscriptionClient } from 'subscription-client';
import { GraphQLClient } from 'graphql-request';
import { ChainEnum } from './chains';

export const subgraphClients: Partial<Record<ChainEnum, GraphQLClient>> = {
  [ChainEnum.RSK_TESTNET]: new GraphQLClient(
    'https://babelfish-subgraph.test.sovryn.app/subgraphs/name/babelfish/rskTestnet-graph'
  ),
  [ChainEnum.RSK]: new GraphQLClient(
    'https://babelfish-subgraph.sovryn.app/subgraphs/name/babelfish/rsk-graph'
  ),
};

export const subgraphWsClients: Partial<Record<ChainEnum, SubscriptionClient>> =
  {
    [ChainEnum.RSK_TESTNET]: new SubscriptionClient(
      'wss://babelfish-subgraph-ws.test.sovryn.app/subgraphs/name/babelfish/rskTestnet-graph',

      {
        reconnect: true,
      }
    ),
    [ChainEnum.RSK]: new SubscriptionClient(
      'wss://babelfish-subgraph-ws.sovryn.app/subgraphs/name/babelfish/rsk-graph',
      {
        reconnect: true,
      }
    ),
  };
