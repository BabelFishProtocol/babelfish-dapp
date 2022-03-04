import { BigNumber, utils } from 'ethers';
import { useCallback } from 'react';
import { AgregatorComponent } from './Agregator.component';
import { AgregatorFormValues } from './Agregator.types';

const mockAvailableBalance = '81.123';

export const AgregatorContainer = () => {
  // WIP: use useCallback here
  const getTokenAvaliableBalance = useCallback(
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

  const onSubmit = (data: AgregatorFormValues) => {
    // TODO: implement
    // eslint-disable-next-line no-console
    console.log(data);
  };
  return (
    <AgregatorComponent
      getTokenAvaliableBalance={getTokenAvaliableBalance}
      getReceiveAmount={getReceiveAmount}
      onSubmit={onSubmit}
    />
  );
};
