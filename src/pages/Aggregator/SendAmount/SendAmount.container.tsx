import { FieldValues } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { SendAmountComponent } from './SendAmount.component';
import {
  feesAndLimitsSelector,
  startingTokenBalanceSelector,
  startingTokenBalanceStateSelector,
  startingTokenDecimalsSelector,
} from '../../../store/aggregator/aggregator.selectors';
import { SendAmountContainerProps } from './SendAmount.types';

export const SendAmount = <FormValues extends FieldValues>(
  props: SendAmountContainerProps<FormValues>
) => {
  const startingTokenBalance = useSelector(startingTokenBalanceSelector);
  const startingTokenDecimals = useSelector(startingTokenDecimalsSelector);
  const startingTokenBalanceState = useSelector(
    startingTokenBalanceStateSelector
  );
  const feesAndLimits = useSelector(feesAndLimitsSelector);

  return (
    <SendAmountComponent
      startingTokenBalance={startingTokenBalance}
      startingTokenDecimals={startingTokenDecimals}
      startingTokenBalanceState={startingTokenBalanceState}
      feesAndLimits={feesAndLimits}
      {...props}
    />
  );
};
