import { BigNumber } from 'ethers';
import { Control } from 'react-hook-form';

export enum DelegateFields {
  delegateTo = 'delegateTo',
}

export type DelegateValues = {
  [DelegateFields.delegateTo]: string;
};

export enum WithdrawVestFields {
  withdrawTo = 'withdrawVestTo',
}

export type WithdrawVestFormValues = {
  [WithdrawVestFields.withdrawTo]: string;
};

export const withdrawVestDefaultValues = {
  [WithdrawVestFields.withdrawTo]: '',
};

export const delegateDefaultValues = {
  [DelegateFields.delegateTo]: '',
};

export type DelegateFeeEstimator = (
  delegateTo: string
) => Promise<BigNumber | undefined>;

export type WithdrawFeeEstimator = (
  withdrawTo: string
) => Promise<BigNumber | undefined>;

export type FeeEstimatorProps = {
  estimateFee: DelegateFeeEstimator;
  control: Control<DelegateValues>;
};

export type FeeEstimatorWithdrawProps = {
  estimateFee: WithdrawFeeEstimator;
  control: Control<WithdrawVestFormValues>;
};

export type UseEstimateDelegateFeeConfig = {
  delegateTo: string;
  withdrawTo?: string;
  estimator: DelegateFeeEstimator;
};
