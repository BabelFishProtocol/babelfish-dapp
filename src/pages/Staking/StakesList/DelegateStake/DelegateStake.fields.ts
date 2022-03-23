import { Fields } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';

export const DelegateStakeFields = Fields;

export type DelegateStakeValues = {
  [DelegateStakeFields.delegateTo]: string;
};

export const delegateStakeDefaultValues = {
  [DelegateStakeFields.delegateTo]: '',
};
