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
};

export type ContractsAddresses = Partial<
  Record<ChainEnum, ContractsForNetwork>
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
  },
};
