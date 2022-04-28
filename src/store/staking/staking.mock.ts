import { combineReducers, DeepPartial } from '@reduxjs/toolkit';
import { constants } from 'ethers';
import { rootReducer, RootState } from '..';
import { Reducers } from '../../constants';
import { ERC20__factory, Staking__factory } from '../../contracts/types';
import { StakingHistoryListItem } from '../../pages/Staking/StakingHistory/StakingHistory.types';
import { createMockedContract, mockSigner } from '../../testUtils';
import { pick } from '../../utils/helpers';
import { FiniteStates } from '../../utils/types';
import { StakeListItem, StakingState } from './staking.state';

export const stakes = ['100000', '150000'];
export const dates = [1645564671, 1645564672];
export const delegates = ['0x0000', '0x3443'];

export const stakingInitialState: DeepPartial<RootState> = {
  [Reducers.Staking]: { ...new StakingState() },
};

export const testAccount = '0x0123';
export const votingPower = '55566456546';
export const kickoffTS = 435767887;
export const WEIGHT_FACTOR = '1000';
export const totalStaked = '55566456546';
export const fishBalance = '232347482374623';
export const allowanceForStaking = '1000000';

export const stakingReducer = combineReducers(
  pick(rootReducer, [Reducers.Staking])
);

export const combinedStakesList: StakeListItem[] = [
  {
    asset: 'FISH',
    unlockDate: dates[0],
    lockedAmount: stakes[0],
    votingDelegation: delegates[0],
  },
  {
    asset: 'FISH',
    unlockDate: dates[1],
    lockedAmount: stakes[1],
    votingDelegation: delegates[1],
  },
];

export const mockStaking = createMockedContract(
  Staking__factory.connect(constants.AddressZero, mockSigner),
  true
);

export const mockFishToken = createMockedContract(
  ERC20__factory.connect(constants.AddressZero, mockSigner),
  true
);

export const txHashes = ['0x05644455', '0x3443'];

export const combinedHistoryStakesList: StakingHistoryListItem[] = [
  {
    asset: 'FISH',
    unlockDate: dates[0].toString(),
    stakedAmount: stakes[0],
    totalStaked: stakes[0],
    txHash: txHashes[0],
  },
  {
    asset: 'FISH',
    unlockDate: dates[1].toString(),
    stakedAmount: stakes[0],
    totalStaked: stakes[1],
    txHash: txHashes[1],
  },
];

export const successStakingState: StakingState = {
  combinedVotingPower: { state: 'success' as FiniteStates, data: votingPower },
  stakesList: { state: 'success' as FiniteStates, data: combinedStakesList },
  constants: {
    data: { kickoffTs: kickoffTS, WEIGHT_FACTOR },
    state: 'success' as FiniteStates,
  },
  stakesListHistory: {
    state: 'success' as FiniteStates,
    data: combinedHistoryStakesList,
  },
  fishToken: {
    state: 'success' as FiniteStates,
    data: { allowanceForStaking, fishBalance, totalStaked },
  },
  selectedStake: combinedStakesList[0].unlockDate,
  addNewStakeCall: {
    status: 'idle',
    steps: [],
  },
  increaseCall: {
    status: 'idle',
    steps: [],
  },
};

export const failureStakingState: StakingState = {
  combinedVotingPower: { state: 'failure' as FiniteStates, data: undefined },
  stakesList: { state: 'failure' as FiniteStates, data: [] },
  constants: { state: 'failure' as FiniteStates, data: {} },
  stakesListHistory: { state: 'failure' as FiniteStates, data: [] },
  fishToken: { state: 'failure' as FiniteStates, data: {} },
  selectedStake: undefined,
  addNewStakeCall: {
    status: 'idle',
    steps: [],
  },
  increaseCall: {
    status: 'idle',
    steps: [],
  },
};
