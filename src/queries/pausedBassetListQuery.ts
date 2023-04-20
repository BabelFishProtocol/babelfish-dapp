import { gql, GraphQLClient } from 'graphql-request';
import { IBAsset } from '../gql/graphql';

export type PausedBassetListQueryItem = Pick<IBAsset, 'id' | 'symbol'>;

const getPausedBassetListDocument = gql`
  query getBassetList {
    bassets(where: { paused: true }) {
      id
      symbol
    }
  }
`;

export const pausedBassetListQuery = async (client: GraphQLClient) =>
  client.request(getPausedBassetListDocument);
