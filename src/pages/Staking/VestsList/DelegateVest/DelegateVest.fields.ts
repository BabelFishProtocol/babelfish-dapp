import { Fields } from '../../DelegateFeeEstimator/DelegateFeeEstimator.fields';

export const DelegateVestFields = Fields;

export type DelegateVestValues = {
  [DelegateVestFields.delegateTo]: string;
};

export const delegateVestDefaultValues = {
  [DelegateVestFields.delegateTo]: '',
};
