import { BigNumber } from 'ethers';
import { Vesting__factory } from '../../contracts/types/factories/Vesting__factory';
import { createMockedContract, mockSigner } from '../../testUtils';
import { VestingState, VestListItem } from './vesting.state';

export const vestingAddress = '0x94e907f6B903A393E14FE549113137CA6483b5ef';
export const accountAddress = '0x012A3';

export const stakes = ['100000', '150000'];
export const dates = [BigNumber.from(1645564671), BigNumber.from(1645564672)];
export const delegates = ['0x3443'];
export const cliff = BigNumber.from(2419200);

export const combinedVestsList: VestListItem[] = [
  {
    asset: 'FISH',
    unlockDate: dates[0].toNumber(),
    lockedAmount: stakes[0],
    votingDelegation: delegates[0],
    stakingPeriodStart: dates[0].toNumber(),
    address: vestingAddress,
    addressType: 'genesis',
    cliff: cliff.toNumber(),
  },
  {
    asset: 'FISH',
    unlockDate: dates[1].toNumber(),
    lockedAmount: stakes[1],
    votingDelegation: delegates[0],
    stakingPeriodStart: dates[1].toNumber(),
    address: vestingAddress,
    addressType: 'team',
    cliff: cliff.toNumber(),
  },
];

export const createMockVestingContract = (address: string) =>
  createMockedContract(Vesting__factory.connect(address, mockSigner), true);

export const successVestingState: VestingState = {
  selectedVest: combinedVestsList[0],
  vestsList: {
    state: 'success',
    data: combinedVestsList,
  },
};

export const failureVestingState: VestingState = {
  selectedVest: undefined,
  vestsList: {
    state: 'failure',
    data: [],
  },
};
