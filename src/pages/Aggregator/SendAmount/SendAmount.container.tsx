import { FieldValues } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { utils } from 'ethers';
import { SendAmountComponent } from './SendAmount.component';
import {
  feesAndLimitsSelector,
  startingTokenBalanceSelector,
  startingTokenBalanceStateSelector,
  startingTokenDecimalsSelector,
} from '../../../store/aggregator/aggregator.selectors';
import { SendAmountContainerProps } from './SendAmount.types';
import { fieldsErrors } from '../../../constants';

export const SendAmount = <FormValues extends FieldValues>(
  props: SendAmountContainerProps<FormValues>
) => {
  const startingTokenBalance = useSelector(startingTokenBalanceSelector);
  const startingTokenDecimals = useSelector(startingTokenDecimalsSelector);
  const startingTokenBalanceState = useSelector(
    startingTokenBalanceStateSelector
  );
  const { minTransfer, maxTransfer } = useSelector(feesAndLimitsSelector);

  const validate = useCallback(
    (v: string) => {
      if (!startingTokenBalance) return true;
      if (utils.parseUnits(v, startingTokenDecimals).gt(startingTokenBalance)) {
        return fieldsErrors.amountGreaterThanBalance;
      }
      if (
        maxTransfer &&
        utils.parseUnits(v, startingTokenDecimals).gt(maxTransfer)
      ) {
        return fieldsErrors.amountGreaterThanMaxLimit;
      }
      if (
        minTransfer &&
        utils.parseUnits(v, startingTokenDecimals).lt(minTransfer)
      ) {
        return fieldsErrors.amountLessThanMinLimit;
      }
    },
    [maxTransfer, minTransfer, startingTokenBalance, startingTokenDecimals]
  );

  return (
    <SendAmountComponent
      startingTokenBalance={startingTokenBalance}
      startingTokenDecimals={startingTokenDecimals}
      startingTokenBalanceState={startingTokenBalanceState}
      validate={validate}
      {...props}
    />
  );
};
