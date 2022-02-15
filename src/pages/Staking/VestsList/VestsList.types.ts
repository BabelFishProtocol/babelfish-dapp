import { StakeListItem } from '../../../store/staking/staking.state';

export type VestsListItem = StakeListItem & {
  stakingDate: string;
};

export type VestsListComponentProps = {
  vests: VestsListItem[];
};
