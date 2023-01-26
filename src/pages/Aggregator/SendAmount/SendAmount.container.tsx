import { FieldValues } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { utils } from 'ethers';
import { SendAmountComponent } from './SendAmount.component';
import {
  destinationChainSelector,
  destinationTokenAggregatorBalanceSelector,
  feesAndLimitsSelector,
  startingTokenBalanceSelector,
  startingTokenBalanceStateSelector,
  startingTokenDecimalsSelector,
} from '../../../store/aggregator/aggregator.selectors';
import { SendAmountContainerProps } from './SendAmount.types';
import { fieldsErrors } from '../../../constants';
import { TokenEnum } from '../../../config/tokens';
import { ChainEnum } from '../../../config/chains';

export const SendAmount = <FormValues extends FieldValues>(
  props: SendAmountContainerProps<FormValues>
) => {
  const startingTokenBalance = useSelector(startingTokenBalanceSelector);
  const startingTokenDecimals = useSelector(startingTokenDecimalsSelector);
  const startingTokenBalanceState = useSelector(
    startingTokenBalanceStateSelector
  );
  const destinationTokenAggregatorBalance = useSelector(
    destinationTokenAggregatorBalanceSelector
  );
  const destinationChain = useSelector(destinationChainSelector);
  const { minTransfer, maxTransfer } = useSelector(feesAndLimitsSelector);

  const validate = useCallback(
    (amount: string) => {
      const { startingTokenName } = props;

      if (!startingTokenBalance) {
        return true;
      }
      if (
        utils.parseUnits(amount, startingTokenDecimals).gt(startingTokenBalance)
      ) {
        return fieldsErrors.amountGreaterThanBalance;
      }
      if (
        maxTransfer &&
        utils.parseUnits(amount, startingTokenDecimals).gt(maxTransfer)
      ) {
        return fieldsErrors.amountGreaterThanMaxLimit;
      }
      if (
        minTransfer &&
        utils.parseUnits(amount, startingTokenDecimals).lt(minTransfer)
      ) {
        return fieldsErrors.amountLessThanMinLimit;
      }
      if (utils.parseUnits(amount, startingTokenDecimals).isZero()) {
        return fieldsErrors.amountEqualZero;
      }
      if (
        startingTokenName === TokenEnum.XUSD &&
        destinationChain &&
        [ChainEnum.RSK, ChainEnum.RSK_TESTNET].includes(destinationChain) &&
        destinationTokenAggregatorBalance !== undefined &&
        utils
          .parseUnits(amount, startingTokenDecimals)
          .gt(destinationTokenAggregatorBalance)
      ) {
        return fieldsErrors.amountGreaterThanAggregatorBalance;
      }
    },
    [
      destinationChain,
      destinationTokenAggregatorBalance,
      maxTransfer,
      minTransfer,
      props,
      startingTokenBalance,
      startingTokenDecimals,
    ]
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
