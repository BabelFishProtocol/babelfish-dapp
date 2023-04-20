import {
  ChainEnum,
  mainnetChains,
  mainnetChainsArr,
  testnetChainsArr,
} from '../../config/chains';
import { contractsAddresses } from '../../config/contracts';
import { subgraphClients, subgraphWsClients } from '../../config/subgraph';
import { appState } from './app.mock';
import {
  addressesSelector,
  chainsInCurrentNetworkSelector,
  currentChainSelector,
  subgraphClientSelector,
  subgraphWsClientSelector,
  supportedNetworksNamesSelector,
  testnetMainnetSelector,
  unsupportedNetworkSelector,
} from './app.selectors';

describe('app selectors', () => {
  it('supportedNetworksNamesSelector returns supported names', async () => {
    const supportedNetworksNames = supportedNetworksNamesSelector.resultFunc(
      appState.supportedNetworks
    );

    expect(supportedNetworksNames).toEqual(['RSK', 'RSK Testnet']);
  });

  describe('unsupportedNetworkSelector', () => {
    it('returns true when chain is unsupported', () => {
      const isUnsupportedNetwork = unsupportedNetworkSelector.resultFunc(
        appState.supportedNetworks,
        1234
      );

      expect(isUnsupportedNetwork).toBe(true);
    });

    it('returns false when chain is supported', () => {
      const isUnsupportedNetwork = unsupportedNetworkSelector.resultFunc(
        appState.supportedNetworks,
        appState.chainId
      );

      expect(isUnsupportedNetwork).toBe(false);
    });

    it('returns false when no chain', () => {
      const isUnsupportedNetwork = unsupportedNetworkSelector.resultFunc(
        appState.supportedNetworks,
        undefined
      );

      expect(isUnsupportedNetwork).toBe(false);
    });
  });

  describe('testnetMainnetSelector', () => {
    it('returns mainnet', () => {
      const testnetMainnet = testnetMainnetSelector.resultFunc(
        appState.chainId
      );

      expect(testnetMainnet).toBe('mainnet');
    });

    it('returns testnet', () => {
      const testnetMainnet = testnetMainnetSelector.resultFunc(
        ChainEnum.ETH_TESTNET
      );

      expect(testnetMainnet).toBe('testnet');
    });
  });

  describe('chainsInCurrentNetworkSelector', () => {
    it('returns for mainnet', () => {
      const chains = chainsInCurrentNetworkSelector.resultFunc('mainnet');

      expect(chains).toBe(mainnetChainsArr);
    });

    it('returns for testnet', () => {
      const chains = chainsInCurrentNetworkSelector.resultFunc('testnet');

      expect(chains).toBe(testnetChainsArr);
    });
  });

  describe('currentChainSelector', () => {
    it('returns true when current chain', () => {
      const currentChain = currentChainSelector.resultFunc(appState.chainId);

      expect(currentChain).toEqual(mainnetChains[ChainEnum.RSK]);
    });

    it('returns  undefined when not found', () => {
      const currentChain = currentChainSelector.resultFunc(999);

      expect(currentChain).toBe(undefined);
    });
  });

  describe('subgraphClientSelector', () => {
    it('returns client when found', () => {
      const client = subgraphClientSelector.resultFunc('testnet');

      expect(client).toEqual(subgraphClients[ChainEnum.RSK_TESTNET]);
    });

    it('returns undefined when not found', () => {
      const client = subgraphClientSelector.resultFunc(undefined);

      expect(client).toBe(undefined);
    });
  });

  describe('subgraphWsClientSelector', () => {
    it('returns ws client when found', () => {
      const client = subgraphWsClientSelector.resultFunc('mainnet');

      expect(client).toEqual(subgraphWsClients[ChainEnum.RSK]);
    });

    it('returns undefined when not found', () => {
      const client = subgraphWsClientSelector.resultFunc(undefined);

      expect(client).toBe(undefined);
    });
  });

  describe('addressesSelector', () => {
    it('returns contract addresses when exist for chain', () => {
      const chainConfig = mainnetChains[ChainEnum.RSK];
      const currentChain = addressesSelector.resultFunc(chainConfig);

      expect(currentChain).toEqual(contractsAddresses[ChainEnum.RSK]);
    });

    it('returns undefined when not found', () => {
      const chainConfig = mainnetChains[ChainEnum.ETH];
      const currentChain = addressesSelector.resultFunc(chainConfig);

      expect(currentChain).toEqual(undefined);
    });
  });
});
