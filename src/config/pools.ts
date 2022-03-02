// import { NetworkChainId, NetworkType } from 'types';
import { ChainEnum, chains, ChainType } from './chains';
import { tokens, TokenTypeBase } from './tokens';

// import { BridgeDetails } from '../models/BridgeDetails';
// import { NetworkDictionary } from './index';
// import { APP_MODE } from '../utils/network-utils';
// import { NetworkDetails } from '../models/NetworkDetails';
// import { unique } from '../utils/helpers';

// import { rskEthTesnetAssets } from './assets/rsk-eth-testnet-assets';
// import { ethRskTesnetAssets } from './assets/eth-rsk-testnet-assets';
// import { rskBscTestnetAssets } from './assets/rsk-bsc-testnet-assets';
// import { bscRskTesnetAssets } from './assets/bsc-rsk-testnet-assets';
// import { rskEthMainnetAssets } from './assets/rsk-eth-mainnet-assets';
// import { ethRskMainnetAssets } from './assets/eth-rsk-mainnet-assets';
// import { rskBscMainnetAssets } from './assets/rsk-bsc-mainnet-assets';
// import { bscRskMainnetAssets } from './assets/bsc-rsk-mainnet-assets';

export type BaseChainType = ChainType & {
  bassets: TokenTypeBase[];
};

const mainnetBaseChains: BaseChainType[] = [
  {
    ...chains[ChainEnum.ETH],
    bassets: [tokens.USDT, tokens.USDC, tokens.DAI, tokens.USDP],
  },
  {
    ...chains[ChainEnum.BSC],
    bassets: [tokens.USDT, tokens.USDC, tokens.BUSD, tokens.DAI, tokens.USDP],
  },
];
export const mainnetPool = {
  baseChains: mainnetBaseChains,
  masset: tokens.XUSD,
  masterChain: chains.RSK,
};

// export class BridgeDictionary {
//   public static bridges: BridgeDetails[] = [
//     // RSK-BSC mainnet bridges
//     new BridgeDetails(
//       NetworkType.RSK,
//       NetworkChainId.RSK_MAINNET,
//       NetworkChainId.BSC_MAINNET,
//       '0x971b97c8cc82e7d27bc467c2dc3f219c6ee2e350',
//       rskBscMainnetAssets
//     ),
//     new BridgeDetails(
//       NetworkType.BSC,
//       NetworkChainId.BSC_MAINNET,
//       NetworkChainId.RSK_MAINNET,
//       '0xdfc7127593c8af1a17146893f10e08528f4c2aa7',
//       bscRskMainnetAssets
//     ),
//     // RSK-BSC testnet bridges
//     new BridgeDetails(
//       NetworkType.RSK,
//       NetworkChainId.RSK_TESTNET,
//       NetworkChainId.BSC_TESTNET,
//       '0x2b2bcad081fa773dc655361d1bb30577caa556f8',
//       rskBscTestnetAssets
//     ),
//     new BridgeDetails(
//       NetworkType.BSC,
//       NetworkChainId.BSC_TESTNET,
//       NetworkChainId.RSK_TESTNET,
//       '0x862e8aff917319594cc7faaae5350d21196c086f',
//       bscRskTesnetAssets
//     ),
//     // RSK-ETH mainnet bridges
//     new BridgeDetails(
//       NetworkType.RSK,
//       NetworkChainId.RSK_MAINNET,
//       NetworkChainId.ETH_MAINNET,
//       '0x1CcAd820B6d031B41C54f1F3dA11c0d48b399581',
//       rskEthMainnetAssets
//     ),
//     new BridgeDetails(
//       NetworkType.ETH,
//       NetworkChainId.ETH_MAINNET,
//       NetworkChainId.RSK_MAINNET,
//       '0x33C0D33a0d4312562ad622F91d12B0AC47366EE1',
//       ethRskMainnetAssets
//     ),
//     // RSK-ETH testnet bridges
//     new BridgeDetails(
//       NetworkType.RSK,
//       NetworkChainId.RSK_TESTNET,
//       NetworkChainId.ETH_TESTNET,
//       '0xC0E7A7FfF4aBa5e7286D5d67dD016B719DCc9156',
//       rskEthTesnetAssets
//     ),
//     new BridgeDetails(
//       NetworkType.ETH,
//       NetworkChainId.ETH_TESTNET,
//       NetworkChainId.RSK_TESTNET,
//       '0x2b456e230225C4670FBF10b9dA506C019a24cAC7',
//       ethRskTesnetAssets
//     ),
//   ];

//   public static listNetworks() {
//     return this.bridges
//       .map((item) => item.mainChainId)
//       .filter(unique)
//       .map((item) => NetworkDictionary.getByChainId(item) as NetworkDetails)
//       .filter((item) => item.mode === APP_MODE);
//   }

//   public static getSideBridges(networkType: NetworkType) {
//     const network = this.listNetworks().find(
//       (item) => item.network === networkType
//     );
//     if (network === undefined)
//       throw new Error(`There is no bridge for ${networkType} network.`);
//     return this.bridges.filter((item) => item.sideChainId === network.chainId);
//   }

//   public static getMainBridges(sideNetworkType: NetworkType) {
//     const network = this.listNetworks().find(
//       (item) => item.network === sideNetworkType
//     );
//     if (network === undefined)
//       throw new Error(`There is no bridge for ${sideNetworkType} network.`);
//     return this.bridges.filter((item) => item.mainChainId === network.chainId);
//   }

//   public static getSideNetworks(sideNetworkType: NetworkType) {
//     return this.getMainBridges(sideNetworkType).map(
//       (item) =>
//         NetworkDictionary.getByChainId(item.sideChainId) as NetworkDetails
//     );
//   }

//   public static getMainNetworks(networkType: NetworkType) {
//     return this.getSideBridges(networkType).map(
//       (item) =>
//         NetworkDictionary.getByChainId(item.mainChainId) as NetworkDetails
//     );
//   }

//   public static get(mainNetwork: NetworkType, sideNetwork: NetworkType) {
//     const mainChainId = NetworkDictionary.getChainId(mainNetwork);
//     const sideChainId = NetworkDictionary.getChainId(sideNetwork);
//     return this.getByChainId(mainChainId, sideChainId) as BridgeDetails;
//   }

//   public static getByChainId(
//     mainChainId: NetworkChainId,
//     sideChainId: NetworkChainId
//   ) {
//     return this.bridges.find(
//       (item) =>
//         item.mainChainId === mainChainId && item.sideChainId === sideChainId
//     );
//   }
// }
