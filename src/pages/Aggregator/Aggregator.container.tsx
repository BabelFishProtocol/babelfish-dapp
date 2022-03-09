import { BigNumber, utils } from 'ethers';
import { useCallback } from 'react';
import { AggregatorComponent } from './Aggregator.component';
import { AggregatorFormValues } from './Aggregator.fields';

const mockAvailableBalance = '81.123';

export const AggregatorContainer = () => {
  // WIP: use useCallback here
  const getTokenAvailableBalance = useCallback(
    () =>
      // todo: implement
      utils.parseEther(mockAvailableBalance),
    [mockAvailableBalance]
  );

  const getReceiveAmount = (sendAmount: string) =>
    // todo: implement
    utils.formatUnits(
      utils
        .parseUnits(sendAmount)
        .mul(BigNumber.from(95))
        .div(BigNumber.from(100))
    );

  const onSubmit = (data: AggregatorFormValues) => {
    // TODO: implement
    // eslint-disable-next-line no-console
    console.log(data);
  };
  return (
    <AggregatorComponent
      getTokenAvailableBalance={getTokenAvailableBalance}
      getReceiveAmount={getReceiveAmount}
      onSubmit={onSubmit}
    />
  );
};
