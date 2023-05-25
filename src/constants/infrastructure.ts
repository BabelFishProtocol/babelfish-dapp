import { Environments } from '../types/global';

export const RSK_RPC = {
  [Environments.Mainnet]: [
    'https://rsk-live.sovryn.app/rpc',
    'https://public-node.rsk.co',
  ],
  [Environments.Testnet]: [
    'https://testnet.sovryn.app/rpc',
    'https://public-node.testnet.rsk.co',
  ],
};

// TODO: refactor this into separate dictionary file once we add more chains
export const RSK_EXPLORER = {
  [Environments.Mainnet]: 'https://explorer.rsk.co',
  [Environments.Testnet]: 'https://explorer.testnet.rsk.co',
};

export const BTC_EXPLORER = {
  [Environments.Mainnet]: 'https://live.blockcypher.com/btc',
  [Environments.Testnet]: 'https://live.blockcypher.com/btc-testnet',
};
