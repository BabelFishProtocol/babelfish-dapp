import { BigNumber } from 'ethers';
import { Control, Path } from 'react-hook-form';

export enum Fields {
  delegateTo = 'delegateTo',
  withdrawTo = 'withdrawTo',
}

export type DelegateValues = {
  [Fields.delegateTo]: string;
};

export type WithdrawValues = {
  [Fields.withdrawTo]: string;
};

export const delegateDefaultValues = {
  [Fields.delegateTo]: '',
};
export const withdrawDefaultValues = {
  [Fields.withdrawTo]: '',
};

export type FeeEstimator = (to: string) => Promise<BigNumber | undefined>;

export interface FeeEstimatorProps<FormValues> {
  name: Path<FormValues>;
  estimateFee: FeeEstimator;
  control: Control<FormValues>;
}

export type UseEstimateDelegateFeeConfig = {
  to: string;
  estimator: FeeEstimator;
};
