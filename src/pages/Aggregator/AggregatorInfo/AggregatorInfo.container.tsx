import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TokenEnum } from '../../../config/tokens';
import {
  incentivesSelector,
  incentivesStateSelector,
  feesAndLimitsSelector,
  feesAndLimitsStateSelector,
  startingTokenDecimalsSelector,
  sendAmountSelector,
  destinationTokenAggregatorBalanceSelector,
  destinationTokenAggregatorBalanceStateSelector,
} from '../../../store/aggregator/aggregator.selectors';
import { AggregatorInfoComponent } from './AggregatorInfo.component';
import { AggregatorInfoContainerProps } from './AggregatorInfo.types';
import { AggregatorInfoErrorComponent } from './AggregatorInfoError.component';
import { AggregatorInfoSwitchComponent } from './AggregatorInfoSwitch.component';
import { Box } from '@mui/material';

export const AggregatorInfoContainer = ({
  toggleFlow,
  startingToken,
  destinationToken,
}: AggregatorInfoContainerProps) => {
  const onClick = () => {
    toggleFlow();
  };

  const feesAndLimitsState = useSelector(feesAndLimitsStateSelector);
  const feesAndLimits = useSelector(feesAndLimitsSelector);
  const tokenDecimals = useSelector(startingTokenDecimalsSelector);
  const incentivesState = useSelector(incentivesStateSelector);
  const incentives = useSelector(incentivesSelector);
  const sendAmount = useSelector(sendAmountSelector);

  const destinationTokenAggregatorBalance = useSelector(
    destinationTokenAggregatorBalanceSelector
  );
  const destinationTokenAggregatorBalanceState = useSelector(
    destinationTokenAggregatorBalanceStateSelector
  );

  const aggregatorBalance = useMemo(
    () =>
      startingToken === TokenEnum.XUSD &&
      destinationToken !== '' &&
      destinationTokenAggregatorBalance
        ? destinationTokenAggregatorBalance
        : undefined,
    [destinationToken, destinationTokenAggregatorBalance, startingToken]
  );

  const errorMessages = useMemo(
    () => {
      let msgs = [];
      if(incentivesState === 'failure') msgs.push('Failure fetching incentives');
      if(feesAndLimitsState === 'failure') msgs.push('Failure fetching bridge fees');
      return msgs;
    },
    [incentivesState, feesAndLimitsState]
  );

  return (
    <div>
    <AggregatorInfoComponent
      onClick={onClick}
      feesAndLimitsState={feesAndLimitsState}
      feesAndLimits={feesAndLimits}
      startingToken={startingToken}
      destinationToken={destinationToken}
      tokenDecimals={tokenDecimals}
      incentivesState={incentivesState}
      incentives={incentives}
      sendAmount={sendAmount!}
      aggregatorBalance={aggregatorBalance}
      aggregatorBalanceState={destinationTokenAggregatorBalanceState}
      errorMessages={errorMessages}
    />
  </div>
  );
};
