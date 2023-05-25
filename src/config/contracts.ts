import { ChainEnum } from './chains';

export type ContractsForNetwork = {
  fishToken: string;
  staking: string;
  governorAdmin: string;
  governorOwner: string;
  vestingRegistry: string;
  feeSharingProxy: string;
  priceFeed: string;
  swapNetwork: string;
  multicall: string;
  XUSDMassetProxy: string;
  rewardManager: string;
};

export type ContractsAddresses = Record<
  ChainEnum.RSK | ChainEnum.RSK_TESTNET,
  ContractsForNetwork
>;

export const contractsAddresses: ContractsAddresses = {
  [ChainEnum.RSK]: {
    staking: '0xFd8ea2e5e8591fA791d44731499cDF2e81CD6a41',
    priceFeed: '0x437AC62769f386b2d238409B7f0a7596d36506e4',
    multicall: '0x6c62bf5440de2cb157205b15c424bceb5c3368f5',
    fishToken: '0x055a902303746382fbb7d18f6ae0df56efdc5213',
    swapNetwork: '0x98aCE08D2b759a265ae326F010496bcD63C15afc',
    governorAdmin: '0xA91b53289375836565ea0c276286561fEd555C85',
    governorOwner: '0x409b92978ca7745DA04f9e62a386774cABE02B46',
    feeSharingProxy: '0x12B1B0C67d9A771EB5Db7726d23fdc6848fd93ef',
    vestingRegistry: '0x036ab2DB0a3d1574469a4a7E09887Ed76fB56C41',
    XUSDMassetProxy: '0x1440d19436bEeaF8517896bffB957a88EC95a00F',
    // TODO: update with address once deployed to mainnet
    rewardManager: '',
  },
  [ChainEnum.RSK_TESTNET]: {
    staking: '0x34a01F53432e2105B7361Aee031F3De629eb7211',
    priceFeed: '0x7f38c422b99075f63C9c919ECD200DF8d2Cf5BD4',
    multicall: '0x9e469e1fc7fb4c5d17897b68eaf1afc9df39f103',
    fishToken: '0xc759D23222791108872De8eb033D132f08692BfE',
    swapNetwork: '0x61172B53423E205a399640e5283e51FE60EC2256',
    governorAdmin: '0x748564bEE62fC471226f6b6213A48BcF3A93945C',
    governorOwner: '0x1547510c48eb322a2199dcf2EA837e4E2870Ebd6',
    feeSharingProxy: '0xBF56E401e3CbE1ddF3d8fEee770d9A3a19076751',
    vestingRegistry: '0xEB0AAD069b452563628CE539df0Da531E2313148',
    XUSDMassetProxy: '0x1572D7E4a78A8AD14AE722E6fE5f5600a2c7A149',
    rewardManager: '0x2f7a90d528bc503fcb884a62dd3e6c5c1d3dbf12',
  },
};
