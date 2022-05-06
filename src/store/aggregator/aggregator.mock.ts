import { constants } from 'ethers';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { Bridge__factory, ERC20__factory, MassetV3__factory } from '../../contracts/types';
import { AggregatorInputs } from '../../pages/Aggregator/Aggregator.fields';
import { createMockedContract, mockSigner } from '../../testUtils';

export const mockTokenAddress = '0x110a13FC3efE6A245B50102D2d79B3E76125Ae83';
export const mockTokenDecimals = 18;
export const mockMassetAddress = '0x971b97c8cc82e7d27bc467c2dc3f219c6ee2e350';
export const mockBassetAddress = '0x971b97c8cc82e7h25bc467c2dc3f219c6ee2e350';
export const mockAccount = '0x5250D37B096099678b0957bae32153915ca2C043';

export const mockToken = createMockedContract(
  ERC20__factory.connect(constants.AddressZero, mockSigner),
  true
);

export const mockBridge = createMockedContract(
  Bridge__factory.connect(constants.AddressZero, mockSigner),
  true
);

export const mockMasset = createMockedContract(
  MassetV3__factory.connect(constants.AddressZero, mockSigner),
  true
);

export const depositMockValues = {
  [AggregatorInputs.StartingChain]: ChainEnum.ETH_TESTNET,
  [AggregatorInputs.StartingToken]: TokenEnum.USDT,
  [AggregatorInputs.SendAmount]: '11',
  [AggregatorInputs.DestinationChain]: ChainEnum.RSK_TESTNET,
  [AggregatorInputs.DestinationToken]: TokenEnum.XUSD,
  [AggregatorInputs.ReceiveAmount]: '10.45',
  [AggregatorInputs.ReceiveAddress]:
    '0x6EEA29791737779006e31bA0e2910045f3e4C8CE',
};
