import { StakeListItem } from '../StakesList/StakesList.types';

export type VestsListItem = StakeListItem & {
  stakingDate: string;
};

export type VestsListComponentProps = {
  vests: VestsListItem[];
};
