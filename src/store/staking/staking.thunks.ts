import { createAsyncThunk } from '@reduxjs/toolkit';
import { Reducers } from '../../constants';
import { StakeListItem, StakingData, VestsListItem } from './staking.state';

const mockStakes: StakeListItem[] = [
  {
    asset: 'FISH',
    lockedAmount: '9,552.8567',
    votingPower: '0.0000',
    votingDelegation: 'No Delegate',
    stakingPeriod: '373 days',
    unlockDate: 1659571200,
  },
  {
    asset: 'FISH',
    lockedAmount: '2,552.8567',
    votingPower: '12.0000',
    votingDelegation: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    stakingPeriod: 'Expired',
    unlockDate: 1677715200,
  },
  {
    asset: 'FISH',
    lockedAmount: '0.8567',
    votingPower: '0.0000',
    votingDelegation: 'No Delegate',
    stakingPeriod: '373 days',
    unlockDate: 1639008000,
  },
];

const mockVests: VestsListItem[] = [
  {
    asset: 'FISH',
    lockedAmount: '9,552.8567 FISH',
    votingPower: '0.0000',
    votingDelegation: '0x0000000000000000000000000000000000000000',
    stakingPeriod: '373 days',
    stakingDate: '12/01/2022 - 9:31:19 am GMT',
    unlockDate: 1659571200,
  },
  {
    asset: 'FISH',
    lockedAmount: '2,552.8567 FISH',
    votingPower: '12.0000',
    votingDelegation: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    stakingPeriod: 'Expired',
    stakingDate: '12/01/2022 - 9:31:19 am GMT',
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
