import { Control } from 'react-hook-form';
import { DateSelectorProps } from '../../../../components/DateSelector/DateSelector.types';
import { DialogFormProps } from '../../../../components/DialogForm/DialogForm.types';
import { StakingFeeEstimator } from '../../Staking.types';
import { ExtendStakeValues } from './ExtendStake.fields';

export type ExtendStakeContainerProps = Pick<
  DialogFormProps,
  'open' | 'onClose'
>;

export type ExtendStakeComponentProps = ExtendStakeContainerProps &
  Pick<DateSelectorProps, 'kickoffTs' | 'stakes'> & {
    prevDate: number;
    stakedAmount: string;
    onExtend: (formValues: ExtendStakeValues) => Promise<void>;
    estimateExtendFee: StakingFeeEstimator;
  };

export type VotingPowerBlockProps = Pick<
  ExtendStakeComponentProps,
  'stakedAmount' | 'prevDate'
> & {
  control: Control<ExtendStakeValues>;
};

export type FeeEstimatorProps = Pick<
  ExtendStakeComponentProps,
  'stakedAmount' | 'estimateExtendFee'
> & {
  control: Control<ExtendStakeValues>;
};
