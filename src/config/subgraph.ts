import { SubscriptionClient } from 'subscription-client';
import { GraphQLClient } from 'graphql-request';
import { ChainEnum } from './chains';

export const subgraphClients: Partial<Record<ChainEnum, GraphQLClient>> = {
  [ChainEnum.RSK_TESTNET]: new GraphQLClient(
    'http://18.224.138.134:8000/subgraphs/name/babelfish/rskTestnet-graph'
  ),
  [ChainEnum.RSK]: new GraphQLClient(
    'http://18.224.138.134:7000/subgraphs/name/babelfish/rsk-graph'
  ),
};

export const subgraphWsClients: Partial<Record<ChainEnum, SubscriptionClient>> =
  {
    [ChainEnum.RSK_TESTNET]: new SubscriptionClient(
      'ws://18.224.138.134:8001/subgraphs/name/babelfish/rskTestnet-graph',
      {
        reconnect: true,
      }
    ),
    [ChainEnum.RSK]: new SubscriptionClient(
      'ws://18.224.138.134:7001/subgraphs/name/babelfish/rsk-graph',
      {
        reconnect: true,
      }
    ),
  };
