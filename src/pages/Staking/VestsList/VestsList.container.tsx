import { VestsListComponent } from './VestsList.component';
import { VestsListItem } from './VestsList.types';

const mockVests: VestsListItem[] = [
  {
    asset: 'FISH',
    lockedAmount: '9,552.8567 FISH',
    votingPower: '0.0000',
    votingDelegation: 'No Delegate',
    stakingPeriod: '373 days',
    stakingDate: '12/01/2022 - 9:31:19 am GMT',
    unlockDate: '30/11/2021 - 9:31:19 pm GMT',
  },
  {
    asset: 'FISH',
    lockedAmount: '2,552.8567 FISH',
    votingPower: '12.0000',
    votingDelegation: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    stakingPeriod: 'Expired',
    stakingDate: '12/01/2022 - 9:31:19 am GMT',
    unlockDate: '30/11/2021 - 9:31:19 pm GMT',
  },
];

export const VestsListContainer = () => (
  <VestsListComponent vests={mockVests} />
);
