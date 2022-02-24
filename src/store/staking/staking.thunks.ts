import { createAsyncThunk } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { StakeListItem, StakingData, VestsListItem } from './staking.state';

const mockStakes: StakeListItem[] = [
  {
    asset: 'FISH',
    lockedAmount: '9552856700000000000',
    votingPower: '0.0000',
    votingDelegation: 'No Delegate',
    unlockDate: 1659571200,
  },
  {
    asset: 'FISH',
    lockedAmount: '2552856700000000000000',
    votingPower: '12.0000',
    votingDelegation: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    unlockDate: 1677715200,
  },
  {
    asset: 'FISH',
    lockedAmount: '8567000000000000',
    votingPower: '0.0000',
    votingDelegation: 'No Delegate',
    unlockDate: 1639008000,
  },
];

const mockVests: VestsListItem[] = [
  {
    asset: 'FISH',
    lockedAmount: '95528567000000000000000',
    votingPower: '0.0000',
    votingDelegation: '0x0000000000000000000000000000000000000000',
    stakingPeriodStart: 1659570200,
    unlockDate: 1659571200,
  },
  {
    asset: 'FISH',
    lockedAmount: '2552856700000000000000000',
    votingPower: '12.0000',
    votingDelegation: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    stakingPeriodStart: 1659570200,
    unlockDate: 1639008000,
  },
];

const mockKickoffTs = 1635379200;

export const fetchStakesListThunk = createAsyncThunk<StakeListItem[]>(
  `${Reducers.Staking}/fetchStakes`,
  async () => {
    try {
      const stakes = mockStakes;

      return stakes;
    } catch (e) {
      // TODO: add error notification
      // eslint-disable-next-line no-console
      console.error(e);
      throw e;
    }
  }
);

export const fetchVestsListThunk = createAsyncThunk<VestsListItem[]>(
  `${Reducers.Staking}/fetchVests`,
  async () => {
    try {
      const vests = mockVests;

      return vests;
    } catch (e) {
      // TODO: add error notification
      // eslint-disable-next-line no-console
      console.error(e);
      throw e;
    }
  }
);

export const initStakePageThunk = createAsyncThunk<StakingData>(
  `${Reducers.Staking}/init`,
  async () => {
    try {
      const kickoffTs = mockKickoffTs;

      return { kickoffTs };
    } catch (e) {
      // TODO: add error notification
      // eslint-disable-next-line no-console
      console.error(e);
      throw e;
    }
  }
);
