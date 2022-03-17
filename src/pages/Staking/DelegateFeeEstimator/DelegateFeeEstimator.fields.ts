import { BigNumber } from 'ethers';
import { Control } from 'react-hook-form';

export enum DelegateFields {
  delegateTo = 'delegateTo',
}

export type DelegateValues = {
  [DelegateFields.delegateTo]: string;
};

export const delegateDefaultValues = {
  [DelegateFields.delegateTo]: '',
};

export type DelegateFeeEstimator = (
  delegateTo: string
) => Promise<BigNumber | undefined>;

export type FeeEstimatorProps = {
  estimateFee: DelegateFeeEstimator;
  control: Control<DelegateValues>;
};

export type UseEstimateDelegateFeeConfig = {
  delegateTo: string;
  estimator: DelegateFeeEstimator;
};
